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
let clientInstance: MongoClient | null = null;
let dbInstance: Db | null = null;


// Implement connection pooling
async function getClientInstance() {
    if (!clientInstance) {
        clientInstance = new MongoClient(process.env.MONGODB_URI || '', {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            maxIdleTimeMS: 30000,
            maxPoolSize: 20,
            minPoolSize: 5,
        });

        try {
            await clientInstance.connect();

            // Add SIGINT handler
            process.on('SIGINT', async () => {
                if (clientInstance) {
                    await clientInstance.close();
                    console.log('MongoDB connection closed');
                }
                process.exit(0);
            });

        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            clientInstance = null;
            throw error;
        }
    }
    return clientInstance;
}

export async function connectToDatabase() {
    const client = await getClientInstance();

    if (!dbInstance) {
        dbInstance = client.db('Cluster0');
    }
    return { gameheadsDB: dbInstance, client };
}

// for google auth - checks if user exists, if not, creates user
export async function getUserFromToken(token: any) {

    // get or create user from email
    const { gameheadsDB } = await connectToDatabase();
    const usersCollection = gameheadsDB.collection('dev');
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
    const { gameheadsDB } = await connectToDatabase();
    const usersCollection = gameheadsDB.collection('dev');
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
    const { gameheadsDB } = await connectToDatabase();
    const usersCollection = gameheadsDB.collection('dev');
    const users = await usersCollection.find().toArray();
    return users.map((user: any) => {
        return {
            fullName: user.full_name,
            gameheadsID: user.gameheadsID,
            created_at: user.created_at
        }
    });
}
