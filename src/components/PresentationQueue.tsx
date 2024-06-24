// src/components/PresentationQueue.tsx

import React, { useState, useEffect } from 'react';
import { MdExitToApp, MdGroup, MdPlayArrow, MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';
import QueueActions from './QueueActions';
interface PresentationQueueProps {
    user: any;
}

interface QueueItem {
    currentTeamId: number;
    currentTeamName: string;
    queueColor: string;
}

interface QueueConfig {
    color: string;
    location: string;
}

const queueConfigs: QueueConfig[] = [
    { color: 'blue', location: 'BLDG 2 - Bleachers' },
    { color: 'green', location: 'BLDG 2 - ROSHAMBO' },
];

const PresentationQueue: React.FC<PresentationQueueProps> = ({ user }) => {
    const [queues, setQueues] = useState<{ [color: string]: QueueItem[] }>({});
    const [sessionStarted, setSessionStarted] = useState(false);

    useEffect(() => {
        fetchQueues();
        checkSessionStatus();

        const intervalId = setInterval(() => {
            fetchQueues();
            checkSessionStatus();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchQueues = async () => {
        const response = await fetch('/api/queue');
        const data: QueueItem[] = await response.json();
        const newQueues = queueConfigs.reduce((acc, config) => {
            acc[config.color] = data.filter(item => item.queueColor === config.color);
            return acc;
        }, {} as { [color: string]: QueueItem[] });
        setQueues(newQueues);
    };

    const checkSessionStatus = async () => {
        const response = await fetch('/api/queue/sessionStatus');
        const data = await response.json();
        setSessionStarted(data.sessionStarted);
    };

    const joinQueue = async () => {
        const joinToast = toast.loading('Joining queue...');
        try {
            const response = await fetch('/api/queue/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                toast.success('Successfully joined the queue', { id: joinToast });
                fetchQueues();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join queue');
            }
        } catch (error: any) {
            toast.error(`${error.message}`, { id: joinToast });
        }
    };

    const leaveQueue = async () => {
        const leaveToast = toast.loading('Leaving queue...');
        try {
            const response = await fetch('/api/queue/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                toast.success('Successfully left the queue', { id: leaveToast });
                fetchQueues();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to leave queue');
            }
        } catch (error: any) {
            toast.error(`Error leaving queue: ${error.message}`, { id: leaveToast });
        }
    };

    const startSession = async () => {
        const startToast = toast.loading('Starting session...');
        try {
            const response = await fetch('/api/queue/startSession', { method: 'POST' });
            if (response.ok) {
                toast.success('Session started successfully', { id: startToast });
                setSessionStarted(true);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to start session');
            }
        } catch (error: any) {
            toast.error(`Error starting session: ${error.message}`, { id: startToast });
        }
    };

    const saveQueue = async () => {
        const saveToast = toast.loading('Saving queue and ending session...');
        try {
            const response = await fetch('/api/queue/save', {
                method: 'POST',
                body: JSON.stringify({ date: new Date().toISOString() }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                toast.success('Ended today\'s session and saved queue successfully', { id: saveToast });
                setSessionStarted(false);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save queue');
            }
        } catch (error: any) {
            toast.error(`Error saving queue: ${error.message}`, { id: saveToast });
        }
    };

    const isUserInQueue = Object.values(queues).flat().some(item => item.currentTeamId === user.profile.currentTeamId);

    const renderQueue = (color: string, location: string) => (
        <div key={color} className="mb-8">
            <h2 className="text-xl font-bold mb-4 capitalize">{color} - {location}</h2>
            {queues[color]?.length > 0 ? (
                queues[color].map((queueItem, index) => {
                    console.log("Loading queue items");
                    return (
                        <div
                            key={queueItem.currentTeamId}
                            className={`flex items-center p-4 rounded border mb-2 ${queueItem.currentTeamId === user.profile.currentTeamId
                                    ? 'bg-green-100 border-green-300 hover:bg-green-200'
                                    : `bg-gray-100 border-gray-300 hover:bg-gray-200`
                                } transition duration-300 ease-in-out`}
                        >
                            <span className="flex-grow">{queueItem.currentTeamName}</span>
                            {queueItem.currentTeamId === user.profile.currentTeamId && (
                                <span className="ml-2 text-green-600 font-semibold">(Your Team)</span>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="text-gray-500 italic p-4 border border-gray-200 rounded">
                    This queue is currently empty.
                </div>
            )}
        </div>
    );

    return (
        <div className="mx-0 sm:mx-28 sm:my-10 shadow-md sm:rounded-md">
            <div className="w-full h-12 sm:h-36 lg:bg-cover bg-center bg-[url('/graphics/default-header.png')] p-8"></div>
            <div className="bg-cream p-8">
                <h1 className="text-2xl sm:text-3xl font-bold my-4 text-center sm:text-left text-headings">Presentation Queues</h1>
                <p className="text-body mb-8 text-sm sm:text-base">Join a queue to present your project</p>

                <QueueActions
                    isUserInQueue={isUserInQueue}
                    user={user}
                    sessionStarted={sessionStarted}
                    joinQueue={joinQueue}
                    leaveQueue={leaveQueue}
                    startSession={startSession}
                    saveQueue={saveQueue}                
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {queueConfigs.map(config => renderQueue(config.color, config.location))}
                </div>
            </div>
        </div>
    );
};

export default PresentationQueue;
