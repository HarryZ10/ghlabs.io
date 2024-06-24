// src/pages/api/queue/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../models/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { gameheadsDB } = await connectToDatabase();
        const queue = await gameheadsDB.collection('queue').find().sort({ timestamp: 1 }).toArray();
        res.status(200).json(queue);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}