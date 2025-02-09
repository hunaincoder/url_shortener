import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";

const port = 3001;
const DATA_FILE = path.join("data", "links.json");

const serveFile = async (res, filepath, contentype) => {
  try {
    const data = await readFile(filepath);
    res.writeHead(200, { "Content-Type": contentype });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
  }
};

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

const server = createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      return serveFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === "/style.css") {
      return serveFile(res, path.join("public", "style.css"), "text/css");
    } else if (req.url === "/links") {
      const links = await loadLinks();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(links));
    } else {
      const links = await loadLinks();
      const shortCode = req.url.slice(1)
      if(links[shortCode]){
        res.writeHead(302, { Location: links[shortCode] });
        return res.end();
      }
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 page not found");
    }
  }

  if (req.method === "POST" && req.url === "/shorten") {
    const links = await loadLinks();

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      console.log(body);
      const { url, shortCode } = JSON.parse(body);

      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("URL is required");
      }

      const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

      // check kart hai kai short code pehle sai exist krta hai kai nahin
      if (links[finalShortCode]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("short code already exists. please choose another one");
      }

      links[finalShortCode] = url;

      await savelinks(links);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ succes: true, shortCode: finalShortCode }));
    });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
