// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import fs from "fs";

type IPFSData = {
  Name: string;
  Hash: string;
  Size: string;
};

const auth =
  "Basic " +
  Buffer.from(
    process.env.NEXT_PUBLIC_INFURA_PID +
      ":" +
      process.env.NEXT_PUBLIC_INFURA_SECRET
  ).toString("base64");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPFSData>
) {
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on("file", async (_name, file) => {
    console.log("Uploaded " + file.originalFilename);
    const formdata = new FormData();
    formdata.append("data", fs.createReadStream(file.filepath));
    const upload = await axios.post(
      "https://ipfs.infura.io:5001/api/v0/add",
      formdata,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const ipfsData = upload.data as IPFSData;
    res.status(200).json(ipfsData);
  });
  res.status(500);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
