import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
// cheerio is tool for analyze webpage and parse HTML
import { load } from "cheerio";

const fetchPageInfo = async (url: string, retries = 3) => {
  try {
    // use axios.get to send out GET request
    // This will only take 'data' property from the respond
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    return { data };
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.code === "ECONNRESET" &&
      retries > 0
    ) {
      console.log(`Retrying... (${3 - retries + 1})`);
      return fetchPageInfo(url, retries - 1);
    } else {
      throw error;
    }
  }
};

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
    const { data } = await fetchPageInfo(url);

    // Use load() from cheerio to get HTML data and assign it variable '$'
    const $ = load(data);

    // Get title tag and meta tag from HTML of destination web
    const title = $("title").text() || "No title found";
    const description =
      $('meta[name="description"]').attr("content") || "No description found";

    return res.status(200).json({ title, description });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching page:", error);
      return res.status(500).json({ message: `Error: ${error}` });
    } else {
      console.error("Unknown error:", error);
      return res
        .status(500)
        .json({ message: "Error fetching page information" });
    }
  }
}
