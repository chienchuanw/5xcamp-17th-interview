import { Schema, model, models } from "mongoose";

export interface UrlProps {
  fullUrl: string;
  shortUrl: string;
  activate: boolean;
  note?: string;
}

const UrlSchema = new Schema<UrlProps>({
  fullUrl: {
    type: String,
    required: [true, "Please provide a valid url"],
    unique: true,
    index: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  note: {
    type: String,
  },
  activate: {
    type: Boolean,
    default: false,
  },
});

export default models.Url || model<UrlProps>("Url", UrlSchema);
