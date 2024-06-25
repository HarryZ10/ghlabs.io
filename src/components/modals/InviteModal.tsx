// src/components/modals/InviteModal.tsx

'use client'

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useInviteModal from "../../hooks/useInviteModal"; 
import { Button, Input, Modal } from "antd";
import { inviteUser } from '../../sdk/inviteAPI';
import SystemError from "../utilities/SystemError";
import { emailSDK } from "../../sdk/emailAPI";

interface InviteModalProps {
    user: any,
    profile: any,
    setProfile: any
}

const InviteModal: React.FC<InviteModalProps> = ({ user, profile, setProfile }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        endorsedUserEmail: ''
    });

    const InviteModal = useInviteModal();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSendEmail = async (invite: boolean) => {
        try {
            if (!invite) {
                await emailSDK.sendEndorseExistingEmail(formData.endorsedUserEmail, profile.gameheadsID, profile.full_name);
                toast.success("Email sent successfully");
            }
            else {
                await emailSDK.sendInvitationEmail(formData.endorsedUserEmail, profile.gameheadsID, profile.full_name);
                toast.success("Invitation sent successfully");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Failed to send email: ${error.message}`);
            } else {
                toast.error('Failed to send email due to an unknown error');
            }
            throw error; // Throw error to prevent further processing in case of failure
        }
    };

    const processEndorsement = async () => {
        try {
            const response = await inviteUser({
                endorsingUserGameheadsId: user.profile.gameheadsID,
                endorsingUserEmail: user.profile.email,
                endorsedUserEmail: formData.endorsedUserEmail,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new SystemError(
                    `Failed to endorse user: ${err.message}`,
                    'ENDORSEMENT_FAILED'
                );
            } else {
                return handleSendEmail(response.status === 201)
            }

        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        processEndorsement()
            .then(() => {
                toast.success('User endorsed and email sent.');
            })
            .catch(error => {
                // Check error code or message and display appropriate toast
                if (error.code === 'ENDORSEMENT_FAILED') {
                    toast.error(error.message);
                } else {
                    // Default error message for unexpected errors
                    toast.error('Failed to endorse user. Please check the details and try again.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal
            style={{ width: '100%', padding: '2%' }}
            footer={null}
            title={<h1>Invite a User</h1>}
            open={InviteModal.isOpen}
            onCancel={InviteModal.onClose}
        >
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="endorsedUserEmail">Email</label>
                    <Input
                        id="endorsedUserEmail"
                        name="endorsedUserEmail"
                        type="email"
                        value={formData.endorsedUserEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <br />
                <Button
                    className="
                        flex 
                        justify-center items-center 
                        w-full py-4
                        bg-green-500
                    "
                    type='primary'
                    htmlType='submit'
                    loading={isLoading}
                >
                    Send Invite
                </Button>
            </form>
        </Modal>
    );
};

export default InviteModal;