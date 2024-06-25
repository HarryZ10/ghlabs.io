import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

type Data = {
    message: string;
};

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
            to,
            from: process.env.EMAIL_SENDER || '',
            subject,
            html,
        };

        try {
            await sgMail.send(msg);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            if (error instanceof Error) {
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
