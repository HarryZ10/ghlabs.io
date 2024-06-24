import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, getUserFromToken } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {

        const token = await getToken({ req });

        if (!token) {
            return res.status(401).json({
                message: "Not authorized 1.",
            });
        }
        if (!token?.email) {
            return res.status(401).json({
                message: "Not authorized 2.",
            });
        }
        const user = await getUserFromToken(token);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized 3.",
            });
        }

        return res.status(200).json({
            profile: user
        });

    }

    if (req.method === 'PUT') {
        // Your PUT method logic
        try {
            const token = await getToken({ req });

            if (!token || !token.email) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const user = await getUserFromToken(token);

            if (!user) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const body = req.body;
            const {
                full_name,
                bio,
                email,
                currentTeamId,
                currentTeamName,
                pronouns,
                siteName,
                ghLevel,
                color1,
                color2,
                contactsMoreInfo,
                role1,
                role2,
                notes
            } = body;

            const { gameheadsDB } = await connectToDatabase();
            const usersCollection = gameheadsDB.collection('dev');
            const userObj = await usersCollection.findOne({ email: user.email });
            
            if (!userObj || !userObj.full_name) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const currentProfile = userObj;

            const newProfile = {
                email: email || currentProfile.email,
                bio: bio || currentProfile.bio,
                full_name: full_name || currentProfile.full_name,
                currentTeamId: currentTeamId || currentProfile.currentTeamId,
                currentTeamName: currentTeamName || currentProfile.currentTeamName,
                pronouns: pronouns || currentProfile.pronouns,
                site: siteName || currentProfile.site,
                level: ghLevel || currentProfile.level,
                color1: color1 || currentProfile.color1,
                color2: color2 || currentProfile.color2,
                contacts: contactsMoreInfo || currentProfile.contacts,
                role1: role1 || currentProfile.role1,
                role2: role2 || currentProfile.role2,
                notes: notes || currentProfile.notes
            };

            console.log("NEW PROFILE:", newProfile);

            await usersCollection.updateOne({ email: user.email }, { $set: { ...newProfile } });

            return res.status(200).json({
                message: `Updated profile for ${user.email}.`,
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Server error." });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
