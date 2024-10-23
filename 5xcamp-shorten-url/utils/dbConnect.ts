import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

// connect MongoDB with URL environment variable
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = globalAny.mongoose;

// if there is no cached, it means it's the first time connecting database which mean mongoose is yet to established.
if (!cached) {
  // this is a "Chained Assignment", which means 'cached' and 'globalAny.mongoose' both point to the same location in memory which is an object of { conn: null, promise: null }.
  cached = globalAny.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Check whether there is a connection. If so, return the existing connection
  if (cached.conn) {
    return cached.conn;
  }
  // If there is no Promise, which means there is no connection. Therefore, we will establish a new connection
  if (!cached.promise) {
    const opts = {};

    // Use mongoose.connect() to establish a connection to MongoDB which will get a Promise.
    cached.promise = mongoose
      .connect(MONGODB_URI, opts) // This will get a Promise
      .then((mongoose) => mongoose); // Use then() to process the Promise, which will give us a mongoose object
  }

  // Assigning a mongoose object to cached.conn
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
