// src/pages/api/queue/leave.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCollection, getConnectedClient, getUserFromToken } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const token = await getToken({ req });

        if (!token || !token?.email) {
            return res.status(401).json({ message: "Not authorized. You must sign in." });
        }

        const user: any = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const usersCollection = await getCollection("dev");
        const queueCollection = await getCollection("queue");
        const client = await getConnectedClient();
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                const devUser = await usersCollection.findOne({ email: user.email }, { session });
                if (!devUser || !devUser.currentTeamId || !devUser.queueColor) {
                    throw new Error("You are not assigned to a team or don't have a queue color.");
                }
                
                const result = await queueCollection.findOneAndDelete(
                    { currentTeamId: devUser.currentTeamId, queueColor: devUser.queueColor },
                    { session }
                );

                if (!result?._id) {
                    throw new Error("Your team is not in the queue.");
                }
            });

            res.status(200).json({ message: 'Left queue successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        } finally {
            await session.endSession();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}