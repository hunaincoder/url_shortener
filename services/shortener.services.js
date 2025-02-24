import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loadLinks = async () => {
  // return await collection.find().toArray();
  //   const [rows] = await db.execute("select * from short_links");
  //   return rows;
  const allshortlinks = await prisma.user.findMany();
  return allshortlinks;
};


export const getLinkByShortCode = async function (shortcode) {
  // return await collection.findOne({ shortcode });
//   const [rows] = await db.execute(
//     "select * from short_links where short_code = ?",
//     [shortcode]
//   );

const shortlinks = await prisma.user.findUnique({
    where : {shortcode : shortcode}
})

return shortlinks
};


export const savelinks = async ({url , shortcode}) => {
  // return await collection.insertOne(links);
//   const [result] = await db.execute(
//     "insert into short_links(short_code , url ) values (?,?)",
//     [shortcode , url]
//   );

const result  = await prisma.user.create({
    data : {
        shortcode : shortcode , 
        url : url
    }
})
  return result;    
};

