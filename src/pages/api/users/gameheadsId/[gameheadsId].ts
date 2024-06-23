import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../models/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        console.log(`Getting profile for ${req.query.traceId}`);
        if (!req.query.traceId) {
            return res.status(400).json({ message: 'Missing trace ID' });
        }
        const traceId = req.query.traceId;
        const { traceDb } = await connectToDatabase();
        const userCollection = traceDb.collection('dev');
        const dbUser = await userCollection.findOne({ "gameheadsID": traceId });

        if (!dbUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            profile: dbUser,
        });
    }

};

export default handler;
