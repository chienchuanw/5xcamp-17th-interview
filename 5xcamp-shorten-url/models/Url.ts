import mongoose from "mongoose";

// Define URL schema in MongoDB with mongoose
// Mongoose allows us to manipulate MongoDB with ODM in Node.js
const UrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: [true, "Please provide a valid url"], // If fullUrl is not provided, error text will be sent in terminal log
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

// First check whether model Url is exist in mongoose.models
// If not, it will create a Url model and bond with UrlSchema via mongoose.models
export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
