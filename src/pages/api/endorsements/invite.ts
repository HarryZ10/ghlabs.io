// src/pages/api/endorsements/invite.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getUserFromToken, getCollection, getDatabase, getConnectedClient, createUserFromEndorsement } from '../../../models/mongodb';
import { ClientSession } from 'mongodb';

interface InviteData {
    endorsingUserGameheadsId: string;
    endorsingUserEmail: string;
    endorsedUserEmail: string;
}

interface ResponseBody {
    message: string;
    user?: { [key: string]: any };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let response: {
        status: number;
        body: ResponseBody;
    } = {
        status: 200,
        body: {
            message: '',
        }
    };

    if (req.method === 'POST') {
        const { endorsingUserGameheadsId, endorsingUserEmail, endorsedUserEmail }: InviteData = req.body;

        if (!endorsingUserGameheadsId || !endorsedUserEmail) {
            response = { status: 400, body: { message: 'Missing required fields' } };
        } else if (endorsingUserEmail == endorsedUserEmail) {
            response = { status: 400, body: { message: 'Cannot endorse yourself' } };
        } else {
            const userCollection = await getCollection("dev");
            const client = await getConnectedClient();
            const session = client.startSession();

            try {
                await session.withTransaction(async () => {
                    const alreadyEndorsed = await userCollection.findOne({
                        email: endorsedUserEmail,
                        users_endorsed_by: endorsingUserGameheadsId
                    }, { session });

                    const endorsedUser = await userCollection.findOne({ email: endorsedUserEmail }, { session });

                    if (alreadyEndorsed) {
                        throw new Error('User already endorsed');
                    }

                    if (!endorsedUser) {
                        const token = await getToken({ req });

                        if (!token || !token?.email) {
                            throw new Error("Not authorized. You must authenticate.");
                        }

                        const user = await getUserFromToken(token);
                        if (!user) {
                            throw new Error("Not authorized. You must authenticate.");
                        }

                        const newUser = await createUserFromEndorsement(endorsedUserEmail, endorsingUserGameheadsId);

                        if (!newUser) {
                            throw new Error("Failed to create user. No email provided or user already exists.");
                        }

                        response = {
                            status: 201,
                            body: { message: "User created successfully.", user: newUser }
                        };
                    } else {
                        await userCollection.updateOne({ email: endorsedUserEmail }, {
                            $addToSet: { users_endorsed_by: endorsingUserGameheadsId }
                        }, { session });

                        await userCollection.updateOne({ gameheadsID: endorsingUserGameheadsId }, {
                            $addToSet: { users_endorsed: endorsedUser.gameheadsID }
                        }, { session });

                        response = { status: 200, body: { message: 'User endorsement updated successfully' } };
                    }
                });
            } catch (error: any) {
                response = { status: 400, body: { message: error.message || 'An error occurred' } };
            } finally {
                await session.endSession();
            }
        }
    } else {
        response = { status: 405, body: { message: 'Method not allowed' } };
    }

    return res.status(response.status).json(response.body);
};

export default handler;
