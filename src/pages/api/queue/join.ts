// src/pages/api/queue/join.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getUserFromToken } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const token = await getToken({ req });

        if (!token || !token?.email) {
            return res.status(401).json({ message: "Not authorized. You must sign in." });
        }

        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const { gameheadsDB, client } = await connectToDatabase();

        const session = client.startSession();
        try {
            await session.withTransaction(async () => {

                // Check if there's an active session
                const activeSession = await gameheadsDB.collection('sessions').findOne({ endDate: null }, { session });
                if (!activeSession) {
                    throw new Error("Please wait for a session to start.");
                }

                const devUser = await gameheadsDB.collection('dev').findOne({ email: user.email }, { session });
                if (!devUser || !devUser.currentTeamId || !devUser.currentTeamName || !devUser.queueColor) {
                    throw new Error("You must be assigned to a team with a valid name and queue color before joining the queue.");
                }

                // Check if the team is already in the queue
                const existingQueueItem = await gameheadsDB.collection('queue').findOne(
                    { currentTeamId: devUser.currentTeamId },
                    { session }
                );

                if (existingQueueItem) {
                    throw new Error("Your team is already in the queue.");
                }

                // Insert the new queue item
                const result = await gameheadsDB.collection('queue').insertOne({
                    currentTeamId: devUser.currentTeamId,
                    currentTeamName: devUser.currentTeamName,
                    timestamp: new Date(),
                    userEmail: user.email,
                    queueColor: devUser.queueColor
                }, { session });

                if (!result.insertedId) {
                    throw new Error("Failed to join the queue.");
                }
            });

            res.status(200).json({ message: 'Joined queue successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        } finally {
            await session.endSession();
        } 
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}