// src/pages/api/queue/sessionStatus.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../models/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { gameheadsDB } = await connectToDatabase();
        const activeSession = await gameheadsDB.collection('sessions').findOne({ endDate: null });

        return res.status(200).json({ sessionStarted: !!activeSession });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
