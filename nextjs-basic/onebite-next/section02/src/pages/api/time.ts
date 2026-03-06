import { NextApiRequest, NextApiResponse } from "next";

export default function handlerq(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const date = new Date();
    res.json({ time: date.toLocaleString() });
}