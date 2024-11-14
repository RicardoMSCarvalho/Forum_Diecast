import mongoose from "mongoose";

const DBCon = async () => {
  try {
    mongoose.connect(process.env.MONGDB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

export default DBCon;
