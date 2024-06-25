// src/sdk/emailAPI.ts

// Define the request body type for sending emails
interface SendEmailData {
    to: string;
    subject: string;
    html: string;
}

// Define the response type for the email-sending function
interface EmailResponse {
    message: string;
}

const EMAIL_API_ENDPOINT = '/api/endorsements/email';

const sendEmail = async (emailData: SendEmailData): Promise<EmailResponse> => {
    const response = await fetch(EMAIL_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
    });

    if (!response.ok) {
        const errorResponse: EmailResponse = await response.json();
        throw new Error(errorResponse.message);
    }

    return response.json();
}

const sendEndorseExistingEmail = async (email: string, endorserId: string, endorserName: string) => {
    const endorserProfileLink = `https://ghlabs-io.vercel.app/profiles/0x${endorserId}`;
    const endorsementDate = new Date().toLocaleDateString();
    const ctaLink = `https://ghlabs-io.vercel.app`;

    const emailContents = `<h1>Hello!,</h1>
  <h3>Great news! You've just been endorsed by another user on GameheadsLab. This endorsement helps increase the trust and authenticity within our community.</h3>
  <p>A quick look at your endorsement:</p>
  <p>Endorsed by: <a href="${endorserProfileLink}">${endorserName}</a><br>
  Date: ${endorsementDate}</p>
  <p>This endorsement has been added to your GameheadsLab profile as meaningful recognition that boosts your credibility at Gameheads.</p>
  <p><a href="${ctaLink}">See Your New Endorsement</a></p>
  <p>No action is required on your part unless you'd like to endorse them back.</p>
  <p>– Gameheads Team & Friends</p>`

    const emailData: SendEmailData = {
        to: email,
        subject: `${endorserName} has Endorsed You on GameheadsLab`,
        html: emailContents
    };

    try {
        const response = await sendEmail(emailData);
        return response;
    }
    catch (e: any) {
        throw new Error(`Failed to send email: ${e.message}`);
    }
}

const sendInvitationEmail = async (email: string, endorserId: string, endorserName: string) => {
    const endorserProfileLink = `https://ghlabs-io.vercel.app/profiles/0x${endorserId}`;
    const ctaLink = `https://ghlabs-io.vercel.app`;
    const endorsementDate = new Date().toLocaleDateString();
 
    const emailContents =
        `<h1>Hello!</h1>
    <h3>Great news! ${endorserName} has invited you to GameheadsLab, a new platform helping Gameheads students and alums like yourself protect and amplify your two most important assets: your personal brand and your work.</h3>
    <p>A quick look at your endorsement:</p>
    <p>Endorsed by: <a href="${endorserProfileLink}">${endorserName}</a><br>Date: ${endorsementDate}</p>
    <p>Consider this your official invitation to join the exclusive, members-only community for authentic developers and thought leaders.</p>
    <p><a href="${ctaLink}">Get Started</a></p>
    <h2>What you Get with GameheadsLab</h2>
    <p>Meet GameheadsLab, a new platform redefining the way SAP and classes operates, showcases, and connects students and their game projects.</p>
    <h2>Keeping it Real</h2>
    <p>Every member of GameheadsLab is verified.</p>
    <p>Have further questions? Drop us a line at <a href="mailto:support@ghlabs.io">support@ghlabs.io</a>.</p>`;

    const emailData: SendEmailData = {
        to: email,
        subject: `${endorserName} has Invited You to GameheadsLab`,
        html: emailContents
    };

    try {
        const response = await sendEmail(emailData);
        return response;
    }
    catch (e: any) {
        throw new Error(`Failed to send email: ${e.message}`);
    }
}

export const emailSDK = {
    sendEmail, sendEndorseExistingEmail, sendInvitationEmail
};