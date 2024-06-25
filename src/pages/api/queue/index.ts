// src/pages/api/queue/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCollection, getConnectedClient } from '../../../models/mongodb';

export const config = {
    maxDuration: 10,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const queueCollection = await getCollection("queue");
        const queue = await queueCollection.find().sort({ timestamp: 1 }).toArray();
        res.status(200).json(queue);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
