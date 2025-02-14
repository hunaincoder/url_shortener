import { readFile, writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";
import express, { response } from "express";
const app = express();

const port = 3001;
const DATA_FILE = path.join("data", "links.json");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // error no entry
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const savelinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links));
};

app.get("/", async (req, res) => {
  try {
    const file = await readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{ shortened-urls }}",
      Object.entries(links)
        .map(
          ([shortcode, url]) => 
          `<li><a href = "/${shortcode}" target ="_blank"> ${req.hostname}/${shortcode} </a> -> ${url}</li>`)
        .join("")
    );

    return res.send(content);
  } catch (error) {
    console.error(error);
    return res.status(500).send("internal server error");
  }
});

app.post("/", async (req, res) => {
  try {
    const { url, shortcode } = req.body;
    const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");
    const links = await loadLinks();
    if (links[finalShortCode]) {
      res
        .status(400)
        .send("short code already exists. please choose another one");
    }
    links[finalShortCode] = url;

    await savelinks(links);
    return res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.get("/:shortcode", async (req, res) => {
  try {
    const links = await loadLinks();
    const shortcode = req.params.shortcode;

    if (!links[shortcode]) {
      return res.status(404).send("not found");
    }
    return res.redirect(links[shortcode]);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
