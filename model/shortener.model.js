// import { readFile, writeFile } from "fs/promises";
// import path from "path";

// const DATA_FILE = path.join("data", "links.json");

// export const loadLinks = async () => {
//   try {
//     const data = await readFile(DATA_FILE, "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       // error no entry
//       await writeFile(DATA_FILE, JSON.stringify({}));
//       return {};
//     }
//     throw error;
//   }
// };

// export const savelinks = async (links) => {
//   await writeFile(DATA_FILE, JSON.stringify(links));
// };

import { db } from "../config/db-client.js";
import { env } from "../config/env.js";

// const db = dbclient.db(env.MONGODB_DATABASE_NAME);
// const collection = db.collection("shortened_links");

export const loadLinks = async () => {
  // return await collection.find().toArray();
  const [rows] = await db.execute("select * from short_links");
  return rows;
};

export const savelinks = async ({url , shortcode}) => {
  // return await collection.insertOne(links);
  const [result] = await db.execute(
    "insert into short_links(short_code , url ) values (?,?)",
    [shortcode , url]
  );
  return result;
};

export const getLinkByShortCode = async function (shortcode) {
  // return await collection.findOne({ shortcode });
  const [rows] = await db.execute(
    "select * from short_links where short_code = ?",
    [shortcode]
  );
  if (rows.length > 0) {
    return rows[0];
  } else {
    return null;
  }
};
