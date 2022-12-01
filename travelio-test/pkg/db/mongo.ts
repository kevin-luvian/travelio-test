import mongoose from "mongoose";

if (!process.env.MONGO_CONN) {
  // throw new Error('Invalid/Missing environment variable: "MONGO_CONN"')
  process.env.MONGO_CONN =
    "mongodb://localhost:4000/mongodb?retryWrites=true&w=majority";
}
const uri = process.env.MONGO_CONN;
console.log("URI:", uri);

mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
});

mongoose.connect(uri);

export default mongoose;
