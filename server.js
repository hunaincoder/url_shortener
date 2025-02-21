import express from "express";
import 'dotenv/config';
import {
  postURLShortener,
  getShortenerPage,
  redirectToShortLink,
} from "./controller/url-shortenener.controller.js";
// import { connectDB } from "./config/db-client.js";
const app = express();

const port = 3001;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", getShortenerPage);

app.post("/", postURLShortener);

app.get("/:shortcode", redirectToShortLink);
try {
  // await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error(error);
}

