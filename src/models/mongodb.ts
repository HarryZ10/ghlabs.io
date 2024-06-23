// mongodb.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import { Db } from 'mongodb';
import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 6);

async function getUniqueIdentifier(usersCollection: any) {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = nanoid();
        const exists = await usersCollection.findOne({ "gameheadsID": uniqueId });
        if (!exists) {
            isUnique = true;
        }
    }

    return uniqueId;
}

// Singleton instance for the MongoDB client
let clientInstance: MongoClient;

// Implement connection pooling
async function getClientInstance() {
    if (!clientInstance) {
        clientInstance = new MongoClient(process.env.MONGODB_URI || '', {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        // Connect only once
        await clientInstance.connect();
    }
    return clientInstance;
}

export async function connectToDatabase() {
    const client = await getClientInstance();
    const traceDb: Db = client.db('Cluster0');
    return { traceDb, client };
}

// for google auth - checks if user exists, if not, creates user
export async function getUserFromToken(token: any) {

    // get or create user from email
    const { traceDb } = await connectToDatabase();
    const usersCollection = traceDb.collection('dev');
    const uniqueId = await getUniqueIdentifier(usersCollection);

    if (!token.email || token.email.length === 0) {
        return null;
    }

    const user = await usersCollection.findOne({ email: token.email });
    console.log(`Found user: ${JSON.stringify(user)}`);

    // Add google auth info if they dont exist yet officially
    if (user && (!user.auth_provider || user.auth_provider.length === 0)) {
        console.log(`Updating user for ${token.email}`)
        await usersCollection.updateOne(
            { email: token.email },
            {
                $set: {
                    ...user,
                    auth_provider: 'google',
                    full_name: token.name,
                    profile_picture: token.picture,
                }
            }
        );
        return user;
    }

    if (!user) {
        // create user
        console.log(`Creating user for ${token.email}`)

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
            last_login_at: Date.now(),
        };
        await usersCollection.insertOne(newUser);
        return newUser;
    }

    return user;
}

// for use after endorsement - checks if user exists, if not, creates user
export async function createUserFromEndorsement(email: string, endorserId: string) {
    const { traceDb } = await connectToDatabase();
    const usersCollection = traceDb.collection('dev');
    const uniqueId = await getUniqueIdentifier(usersCollection);

    if (!email || email.length === 0) {
        return null;
    }

    const user = await usersCollection.findOne({ email: email });

    if (!user) {
        // create user
        console.log(`Creating user for ${email}`)
        const newUser = {
            email: email,
            auth_provider: null,
            fullName: '',
            gameheadsID: uniqueId,
            bio: '',
            socialProfiles: [],
            otherSites: [],
            projects: [],
            profilePicture: '',
            usersEndorsed: [],
            usersEndorsedBy: [],
            created_at: Date.now(),
            last_login_at: Date.now(),
        };
        await usersCollection.insertOne(newUser);
        return newUser;
    }

    return user;
}

export async function getUserList() {
    const { traceDb } = await connectToDatabase();
    const usersCollection = traceDb.collection('dev');
    const users = await usersCollection.find().toArray();
    return users.map((user: any) => {
        return {
            fullName: user.full_name,
            gameheadsID: user.gameheadsID,
            created_at: user.created_at
        }
    });
}
