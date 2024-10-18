import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // 確保在操作資料庫之前已經連接
  res.status(200).json({ message: "Connected to MongoDB!" });
}
