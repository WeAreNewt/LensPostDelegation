import { create } from "ipfs-http-client";
import { NextApiRequest, NextApiResponse } from "next";
import { cors, runMiddleware } from "../../runMiddleware";

type Data = {
    success?: boolean;
    path: string | null;
};

const uploadToIPFS = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {

    try {

        if (req.method !== "POST" || !req.body)
            return res.status(400).json({ success: false, path: null });

        const auth =
            "Basic " +
            Buffer.from(
                process.env.NEXT_PUBLIC_INFURA_PID +
                ":" +
                process.env.NEXT_PUBLIC_INFURA_SECRET
            ).toString("base64");


        const client = await create({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                authorization: auth,
            },
        });

        const { path } = await client.add(JSON.stringify(req.body));

        return res.status(200).json({
            path,
        });
    } catch (e) {
        console.error(e);
        return res.status(200).json({ success: false, path: null });
    }
};

export default uploadToIPFS;
