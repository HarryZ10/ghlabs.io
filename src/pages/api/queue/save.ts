// src/pages/api/queue/save.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken, connectToDatabase } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

function isGameheadsEmail(email: string) {
    return email.endsWith("@gameheadsoakland.org") || email === 'harryzhu11@gmail.com';
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const token = await getToken({ req });

        if (!token || !token?.email) {
            return res.status(401).json({ message: "Not authorized. You must sign in." });
        }

        const user = await getUserFromToken(token);
        if (!user || !isGameheadsEmail(user.email)) {
            return res.status(401).json({ message: "Not authorized. You are not an administrator." });
        }

        const { date } = req.body;
        const { gameheadsDB, client } = await connectToDatabase();

        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                const queue = await gameheadsDB.collection('queue').find({}, { session }).toArray();
                await gameheadsDB.collection('savedQueues').insertOne({ date, queue }, { session });

                await gameheadsDB.collection('sessions').updateOne(
                    { endDate: null },
                    { $set: { endDate: new Date() } },
                    { session }
                );

                await gameheadsDB.collection('queue').deleteMany({}, { session });
            });

            return res.status(200).json({ message: 'Queue saved and session ended successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while saving the queue and ending the session' });
        } finally {
            await session.endSession();
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
