import crypto from "crypto";
import { loadLinks, savelinks } from "../model/shortener.model.js";

export const getShortenerPage = async (req, res) => {
  try {
    const links = await loadLinks();
    return res.render("index" , {links , host : req.hostname})
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
