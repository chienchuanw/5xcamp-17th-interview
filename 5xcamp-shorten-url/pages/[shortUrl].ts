import dbConnect from "@/utils/dbConnect";
import { NextPageContext } from "next";
import Url from "@/models/Url";

export async function getServerSideProps(context: NextPageContext) {
  // Get shortUrl from the url address (query)
  const { shortUrl } = context.query;

  await dbConnect();

  const urlRecord = await Url.findOne({ shortUrl: shortUrl });

  // Return code 404 if shortUrl is not exist or 'activate' is false
  if (!urlRecord || !urlRecord.activate) {
    return {
      notFound: true,
    };
  }

  // Else, redirect to the original fullUrl
  return {
    redirect: {
      destination: urlRecord.fullUrl,
      permanent: false, // This means shortUrl redirect will become invalid if server is down or for some other reasons
    },
  };
}

export default function ShortUrlRedirect() {
  return null;
}
