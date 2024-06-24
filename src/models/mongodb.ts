// mongodb.js
import { ClientSession, MongoClient, ServerApiVersion } from 'mongodb';
import { Db } from 'mongodb';
import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 6);

async function getUniqueIdentifier(usersCollection: any, session: ClientSession) {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = nanoid();
        const exists = await usersCollection.findOne({ "gameheadsID": uniqueId }, { session });
        if (!exists) {
            isUnique = true;
        }
    }

    return uniqueId;
}


let client: MongoClient | null = null;
let dbInstance: Db | null = null;

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 100,
    maxIdleTimeMS: 10000,
    minPoolSize: 20,
};
if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
}

export async function getConnectedClient() {
    if (!client) {
        throw new Error('MongoDB client not initialized');
    }

    try {
        // This will throw an error if not connected
        await client.db().command({ ping: 1 });
    } catch (error) {
        console.log('Reconnecting to MongoDB...');
        await client.connect();
        console.log('New MongoDB connection established');

        // Add SIGINT handler
        process.on('SIGINT', async () => {
            if (client) {
                await client.close();
                console.log('MongoDB connection closed');
            }
            process.exit(0);
        });
    }

    return client;
}

export async function getDatabase() {
    const connectedClient = await getConnectedClient();
    if (!dbInstance) {
        dbInstance = connectedClient.db('Cluster0');
    }
    return dbInstance;
}

export async function getCollection(collectionName: string) {
    const db = await getDatabase();
    return db.collection(collectionName);
}


// for google auth - checks if user exists, if not, creates user
export async function getUserFromToken(token: any) {
    const usersCollection = await getCollection("dev");
    const client = await getConnectedClient();
    const session = client.startSession();

    try {
        let user;
        await session.withTransaction(async () => {
            if (!token.email || token.email.length === 0) {
                throw new Error('Invalid email in token');
            }

            user = await usersCollection.findOne({ email: token.email }, { session });
            console.log(`Found user: ${JSON.stringify(user)}`);

            if (user) {
                if (!user.auth_provider || user.auth_provider.length === 0) {
                    console.log(`Updating user for ${token.email}`);
                    await usersCollection.updateOne(
                        { email: token.email },
                        {
                            $set: {
                                auth_provider: 'google',
                                full_name: token.name,
                                profile_picture: token.picture,
                            }
                        },
                        { session }
                    );
                }
            } else {
                // create user
                console.log(`Creating user for ${token.email}`);
                const uniqueId = await getUniqueIdentifier(usersCollection, session);
                const newUser = {
                    email: token.email,
                    auth_provider: 'google',
                    full_name: token.name,
                    gameheadsID: uniqueId,
                    bio: '',
                    social_links: [],
                    other_links: [],
                    projects: [],
                    profile_picture: token.picture,
                    users_endorsed: [],
                    users_endorsed_by: [],
                    created_at: Date.now(),
                    last_login_at: null,
                    is_new_user: true,
                };
                await usersCollection.insertOne(newUser, { session });
                user = newUser;
            }

            // Update last_login_at for every login
            await usersCollection.updateOne(
                { email: token.email },
                { $set: { last_login_at: Date.now() } },
                { session }
            );
        });

        return user;
    } catch (error) {
        console.error('Error in getUserFromToken:', error);
        return null;
    } finally {
        await session.endSession();
    }
}


// for use after endorsement - checks if user exists, if not, creates user
export async function createUserFromEndorsement(email: string, endorserId: string) {
    const usersCollection = await getCollection("dev");
    const client = await getConnectedClient();

    const session = client.startSession();

    try {
        let user;
        await session.withTransaction(async () => {
            if (!email || email.length === 0) {
                throw new Error('Invalid email');
            }

            user = await usersCollection.findOne({ email: email }, { session });

            if (!user) {
                const uniqueId = await getUniqueIdentifier(usersCollection, session);
                console.log(`Creating user for ${email}`);
                const newUser = {
                    email: email,
                    auth_provider: null,
                    full_name: '',
                    gameheadsID: uniqueId,
                    bio: '',
                    social_links: [],
                    other_links: [],
                    projects: [],
                    profile_picture: '',
                    users_endorsed: [],
                    users_endorsed_by: [endorserId], // Add the endorser's ID
                    created_at: Date.now(),
                    last_login_at: null,
                    is_new_user: true,
                };
                await usersCollection.insertOne(newUser, { session });
                user = newUser;

                // Update the endorser's usersEndorsed array
                await usersCollection.updateOne(
                    { gameheadsID: endorserId },
                    { $addToSet: { users_endorsed: uniqueId } },
                    { session }
                );
            } else {
                // If the user already exists, just update the endorsement arrays
                await usersCollection.updateOne(
                    { email: email },
                    { $addToSet: { users_endorsed_by: endorserId } },
                    { session }
                );
                await usersCollection.updateOne(
                    { gameheadsID: endorserId },
                    { $addToSet: { users_endorsed: user.gameheadsID } },
                    { session }
                );
            }
        });

        return user;
    } catch (error) {
        console.error('Error in createUserFromEndorsement:', error);
        return null;
    } finally {
        await session.endSession();
    }
}

export async function getUserList() {
    const usersCollection = await getCollection("dev");
    const users = await usersCollection.find().toArray();
    return users.map((user: any) => {
        return {
            fullName: user.full_name,
            gameheadsID: user.gameheadsID,
            created_at: user.created_at
        }
    });
}

export async function getTeamList() {
    const teamsCollection = await getCollection("team");
    const teams = await teamsCollection.find().sort({ team_num: 1 }).toArray();
    return teams.map((team: any) => {
        return {
            teamName: team.team_name,
            teamNum: team.team_num
        }
    });
}

