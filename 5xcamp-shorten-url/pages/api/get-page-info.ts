import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed!" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    const { data } = await axios.get(url);
    const $ = load(data);

    const title = $("title").text() || "No title found";

    const response = await axios.head(url);
    const headers = response.headers;

    return res.status(200).json({ title, headers });
  } catch (error) {
    console.error("Error fetching page:", error);
    return res.status(500).json({ message: "Error fetching page information" });
  }
}
