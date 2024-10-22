import Url, { UrlProps } from "@/models/Url";
import dbConnect from "@/utils/dbConnect";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { fullLink } = req.body;

  if (!fullLink) {
    return res.status(400).json({ message: "Please provide an URL." });
  }

  try {
    // checking whether fullLink is already existed in database
    const existingUrl = (await Url.findOne({
      fullUrl: fullLink,
    }).lean()) as UrlProps | null;

    // return the existing shortUrl or generate a new one
    if (existingUrl) {
      return res.status(200).json({
        shortUrl: existingUrl.shortUrl,
        activate: existingUrl.activate,
        note: existingUrl.note,
      });
    } else {
      const generatedShortUrl = `${nanoid(6)}`;
      const newUrl = new Url({
        fullUrl: fullLink,
        shortUrl: generatedShortUrl,
        activate: false,
      });
      await newUrl.save();

      return res.status(201).json({ generatedShortUrl, activate: false });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Cannot query or generate short url" });
    }
    return res.status(500).json({ message: "Unknown error occurred." });
  }
}
