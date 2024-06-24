// src/components/QueueActions.tsx

import React from 'react';
import { MdExitToApp, MdGroup, MdPlayArrow, MdSave } from 'react-icons/md';
import ConfirmModal from '../components/modals/ConfirmModal';
import useConfirmModal from '../hooks/useConfirmModal';

const QueueActions: React.FC<any> = ({ isUserInQueue, user, sessionStarted, joinQueue, leaveQueue, startSession, saveQueue }) => {
    const confirmModal = useConfirmModal();
    const [modalConfig, setModalConfig] = React.useState({
        title: '',
        desc: '',
        confirmText: '',
    });

    const openConfirmModal = (title: string, desc: string, confirmText: string, action: () => void) => {
        setModalConfig({ title, desc, confirmText });
        confirmModal.setConfirmAction(action);
        confirmModal.onOpen();
    };

    return (
        <>
            <div className="flex flex-wrap gap-3 mb-8">
                {isUserInQueue ? (
                    <button
                        onClick={() => openConfirmModal(
                            "Leave Queue",
                            "Are you sure you want to leave the queue?",
                            "Leave",
                            leaveQueue
                        )}
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                        <MdExitToApp className="mr-2" /> Leave Queue
                    </button>
                ) : (
                    <button
                        onClick={() => openConfirmModal(
                            "Join Queue",
                            "Are you sure you want to join the queue?",
                            "Join",
                            joinQueue
                        )}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        <MdGroup className="mr-2" /> Join Queue
                    </button>
                )}
                {user && !sessionStarted && (
                    <button
                        onClick={() => openConfirmModal(
                            "Start Session",
                            "Are you sure you want to start the Saturday session?",
                            "Start",
                            startSession
                        )}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                        <MdPlayArrow className="mr-2" /> Start Saturday Session
                    </button>
                )}
                {user && sessionStarted && (
                    <button
                        onClick={() => openConfirmModal(
                            "Save Queue",
                            "Are you sure you want to save the queue and end the session?",
                            "Save",
                            saveQueue
                        )}
                        className="flex items-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
                    >
                        <MdSave className="mr-2" /> Save Queue
                    </button>
                )}
            </div>

            <ConfirmModal
                title={modalConfig.title}
                desc={modalConfig.desc}
                confirmText={modalConfig.confirmText}
            />
        </>
    );
};

export default QueueActions;
