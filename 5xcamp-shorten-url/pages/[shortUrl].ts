import dbConnect from "@/utils/dbConnect";
import { NextPageContext } from "next";
import Url from "@/models/Url";

export async function getServerSideProps(context: NextPageContext) {
  const { shortUrl } = context.query;

  await dbConnect();

  const urlRecord = await Url.findOne({ shortUrl: shortUrl });

  if (!urlRecord) {
    return {
      notFound: true,
    };
  }

  if (!urlRecord.activate) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: urlRecord.fullUrl,
      permanent: false,
    },
  };
}

export default function ShortUrlRedirect() {
  return null;
}
