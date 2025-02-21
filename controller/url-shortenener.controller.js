import crypto from "crypto";
// import {
//   loadLinks,
//   savelinks,
//   getLinkByShortCode,
// } from "../model/shortener.model.js";
import { urls } from "../schema/url_schema.js";

export const getShortenerPage = async (req, res) => {
  try {
    const links = await urls.find();
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
    const links = await urls.find();
    if (links[finalShortCode]) {
      res
        .status(400)
        .send("short code already exists. please choose another one");
    }
    // await savelinks({ url, shortcode });
    await urls.create({ url, shortcode });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

export const redirectToShortLink = async (req, res) => {
  try {
    // const links = await loadLinks();
    const shortcode = req.params.shortcode;

    const link = await urls.findOne({ shortcode });
    if (!link) {
      return res.status(404).send("not found");
    }
    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
  }
};
