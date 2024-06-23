// components/AccessRestricted.tsx

import Image from 'next/image';
import React from 'react';

const AccessRestricted: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center pt-20">
            <div className="mb-8" style={{ width: '300px' }}>
                <Image
                    src="/logos/color-vertical.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    layout="responsive"
                />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Access Restricted</h1>
            <p>
                <a
                    href="https://www.gameheadsoakland.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                >
                    Click here
                </a>{' '}
                to bookmark new Gameheads student applicants in the Fall/Winter season.
            </p>
        </div>
    );
};

export default AccessRestricted;
