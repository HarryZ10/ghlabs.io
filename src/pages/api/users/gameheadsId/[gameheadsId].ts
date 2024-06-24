import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../models/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        console.log(`Getting profile for ${req.query.gameheadsID}`);
        if (!req.query.gameheadsID) {
            return res.status(400).json({ message: 'Missing gameheads ID' });
        }
        const gameheadsID = req.query.gameheadsID;
        const { gameheadsDB } = await connectToDatabase();
        const userCollection = gameheadsDB.collection('dev');
        const dbUser = await userCollection.findOne({ "gameheadsID": gameheadsID });

        console.log(`Looking at ${gameheadsID} for ${dbUser}`)

        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            profile: dbUser,
        });
    }

};

export default handler;
