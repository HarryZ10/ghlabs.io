import { NextApiRequest, NextApiResponse } from "next";
import { getTeamList } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

export const config = {
    maxDuration: 10,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {

        const token = await getToken({ req });

        if (!token) {
            return res.status(401).json({
                message: "Not authorized 1.",
            });
        }
        if (!token?.email) {
            return res.status(401).json({
                message: "Not authorized 2.",
            });
        }
        const teams = await getTeamList();

        return res.status(200).json({
            result: teams
        }); 
    }

    return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
