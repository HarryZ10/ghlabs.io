// src/pages/api/queue/startSession.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, getConnectedClient, getUserFromToken } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

export const config = {
    maxDuration: 10,
};

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

        const sessionsCollection = await getCollection("sessions");
        const client = await getConnectedClient();
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                const activeSession = await sessionsCollection.findOne({ endDate: null }, { session });
                if (activeSession) {
                    throw new Error('A session is already in progress');
                }

                await sessionsCollection.insertOne({ startDate: new Date(), endDate: null }, { session });
            });

            return res.status(200).json({ message: 'Session started successfully' });
        } catch (error) {
            return res.status(400).json({ message: 'Could not start session, please try again.' });
        } finally {
            await session.endSession();
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
