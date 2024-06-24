// src/pages/api/queue/sessionStatus.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, getConnectedClient } from '../../../models/mongodb';

export const config = {
    maxDuration: 10,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        
        const sessionsCollection = await getCollection("sessions");
        const client = await getConnectedClient();
        const session = client.startSession();
        
        const activeSession = await sessionsCollection.findOne({ endDate: null });

        return res.status(200).json({ sessionStarted: !!activeSession });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
