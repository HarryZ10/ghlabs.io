import { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from '../../../../models/mongodb';
import { getToken } from "next-auth/jwt";

export const config = {
    maxDuration: 10,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        const token = await getToken({ req });

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, you're not signed in!",
            });
        }
        if (!token?.email) {
            return res.status(401).json({
                message: "Not authorized, please log in again!",
            });
        }

        if (!req.query.gameheadsID) {
            return res.status(400).json({ message: 'Missing gameheads ID' });
        }

        const gameheadsID = req.query.gameheadsID;
        const userCollection = await getCollection('dev');
        const dbUser = await userCollection.findOne({ "gameheadsID": gameheadsID });

        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            profile: dbUser,
        });
    }

};

export default handler;
