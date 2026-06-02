import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected")
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`);

  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;



// // import mongoose from "mongoose"

// // const URI="mongodb://localhost:27017/Aimern"

// // const connectDB = async () => {
// //     try {
// //       await mongoose.connect(URI)
// //       console.log("connected sucess")
// //     } catch (error) {
// //       console.error("database connection failed");
// //       // process.exit(0);
// //     }
// //   }

//   export default connectDB;