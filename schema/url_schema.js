import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    id : {type : Number},
    url: String,
    shortcode: String,
})

export const urls = mongoose.model("url" , urlSchema);