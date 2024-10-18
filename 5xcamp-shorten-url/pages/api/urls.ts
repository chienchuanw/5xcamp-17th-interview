import dbConnect from "@/utils/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Url from "@/models/Url";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const urls = await Url.find({});
        res.status(200).json({ success: true, data: urls });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { fullUrl, shortUrl, activate } = req.body;

        const newUrl = new Url({
          fullUrl: fullUrl,
          shortUrl: shortUrl || undefined,
          activate: !!activate,
        });

        await newUrl.save();

        res.status(201).json({ success: true, data: newUrl });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
