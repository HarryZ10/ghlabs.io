import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

type Data = {
    message: string;
};

// A simple type for the request body to ensure type safety.
interface EmailRequestBody {
    to: string;
    subject: string;
    html: string;
}

export const config = {
    maxDuration: 10,
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if (req.method === 'POST') {
        const { to, subject, html }: EmailRequestBody = req.body;

        const msg = {
            to, // Recipient email address
            from: process.env.EMAIL_SENDER || '', // Verified sender
            subject,
            html,
        };

        try {
            await sgMail.send(msg);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                // Log more specific details of the error if available
                console.error('Error sending email:', error.message);
                return res.status(500).json({ message: 'Failed to send email' });
            }

            res.status(500).json({ message: 'Failed to send email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
