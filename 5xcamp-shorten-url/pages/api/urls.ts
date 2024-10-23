import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Url from "@/models/Url";

// 'export default' can be placed at the bottom of this file as well
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to database
  await dbConnect();

  const { fullLink, shortLink, note, activate } = req.body;

  if (!fullLink) {
    return res.status(400).json({ message: "Please provide an URL." });
  }

  try {
    if (req.method === "PATCH") {
      // Update existing url
      const updatedUrl = await Url.findOneAndUpdate(
        { fullUrl: fullLink },
        { activate, shortUrl: shortLink, note: note },
        { new: true }
      );
      if (!updatedUrl) {
        return res.status(404).json({ message: "URL not found." });
      }

      return res.status(200).json({ success: true, updatedUrl });
    } else {
      // Inform that this api only allows PATCH method
      res.setHeader("Allow", ["PATCH"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Cannot process the request", error: error.message });
    } else {
      return res.status(500).json({ message: "Unknown error occurred." });
    }
  }
}
