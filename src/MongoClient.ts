import { MongoClient, ServerApiVersion } from "mongodb";

const uri = String(process.env.DB_URI);

if (!process.env.DB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {
  serverApi: ServerApiVersion.v1,
}; // you can add { serverSelectionTimeoutMS: 5000 } etc. if needed

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so changes are not lost
  // between hot reloads (important for Next.js dev server)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (build & runtime on Vercel), always create fresh but still cache per instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
