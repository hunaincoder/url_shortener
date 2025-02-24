// import mongoose from "mongoose";
// import { env } from "./env.js";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(env.MONGODB_URI);
//   } catch (error) {
//     console.error(error);
//   }
// };


import mysql from "mysql2/promise"; 
import { env } from "./env.js";

// export const db = await mysql.createConnection({
//   host: env.DATABASE_HOST,
//   user: env.DATABASE_USER,
//   password: env.DATABASE_PASSWORD,
//   database: env.DATABASE_NAME
// })
