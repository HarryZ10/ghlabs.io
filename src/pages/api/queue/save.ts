// src/pages/api/queue/save.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, getConnectedClient, getUserFromToken } from '../../../models/mongodb';
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

        const user: any = await getUserFromToken(token);
        if (!user || !isGameheadsEmail(user.email)) {
            return res.status(401).json({ message: "Not authorized. You are not an administrator." });
        }

        const { date } = req.body;
        const usersCollection = await getCollection("dev");
        const queueCollection = await getCollection("queue");
        const savedQueuesCollection = await getCollection("savedQueues")
        const sessionsCollection = await getCollection("sessions");
        
        const client = await getConnectedClient();

        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                const queue = await queueCollection.find({}, { session }).toArray();
                await savedQueuesCollection.insertOne({ date, queue }, { session });

                await sessionsCollection.updateOne(
                    { endDate: null },
                    { $set: { endDate: new Date() } },
                    { session }
                );

                await queueCollection.deleteMany({}, { session });
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
