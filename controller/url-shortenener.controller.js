import crypto from "crypto";
import { loadLinks, savelinks } from "../model/shortener.model";
import { readFile } from "fs/promises";
import path from "path";



export const getShortenerPage = async (req, res) => {
  try {
    const file = await readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{ shortened-urls }}",
      Object.entries(links)
        .map(
          ([shortcode, url]) =>
            `<li><a href = "/${shortcode}" target ="_blank"> ${req.hostname}/${shortcode} </a> -> ${url}</li>`
        )
        .join("")
    );

    return res.send(content);
  } catch (error) {
    console.error(error);
    return res.status(500).send("internal server error");
  }
};

export const postURLShortener = async (req, res) => {
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
};

export const redirectToShortLink = async (req, res) => {
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
};
