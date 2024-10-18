import mongoose from "mongoose";
import { nanoid } from "nanoid";

const UrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: [true, "Please provide a valid url"],
    unique: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    default: function () {
      // create a short url in 6 character with specific domain
      return `https://chienchuanw/${nanoid(6)}`;
    },
  },
  activate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
