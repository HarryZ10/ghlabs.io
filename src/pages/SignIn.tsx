import React from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import { useSession, signIn, signOut } from "next-auth/react"
import { GoogleOutlined } from '@ant-design/icons';

const SignIn = () => {

    return (
        <div className="py-10 px-20">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'center',
            }} >
                <Image
                    src="/logos/gh-logo.png"
                    alt="logo"
                    height={150}
                    width={130}
                />
                <h1>Gameheads<span className="font-bold">Lab</span></h1>

                <p className="max-w-[600px] text-center">
                    Gameheads Labs is a space for students to showcase their projects and connect with others across sites.
                </p>
                <Button
                    className="bg-gh_green-500"
                    type="primary"
                    size="large"
                    icon={<GoogleOutlined />}
                    onClick={() => signIn('google', {
                        prompt: 'select_account',
                    })}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
};

export default SignIn;
