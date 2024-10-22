import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: [true, "Please provide a valid url"],
    unique: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
  },
  note: {
    type: String,
  },
  activate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
