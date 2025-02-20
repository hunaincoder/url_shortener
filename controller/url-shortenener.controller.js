import crypto from "crypto";
import { loadLinks, savelinks , getLinkByShortCode } from "../model/shortener.model.js";

export const getShortenerPage = async (req, res) => {
  try {
    const links = await loadLinks();
    return res.render("index", { links, host: req.hostname });
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
    await savelinks({ url, shortcode });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

export const redirectToShortLink = async (req, res) => {
  try {
    // const links = await loadLinks();
    const shortcode = req.params.shortcode;
    const link  = await getLinkByShortCode(shortcode)
    if (!link) {
      return res.status(404).send("not found");
    }
    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
  }
};
