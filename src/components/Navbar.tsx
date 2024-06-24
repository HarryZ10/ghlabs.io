/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react";
import {
    MenuOutlined,
    CloseOutlined,
    HomeOutlined,
    UserOutlined,
    FundProjectionScreenOutlined,
} from '@ant-design/icons';

import { MdLogout } from "react-icons/md";
import { Page } from "../models/models";

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isLoggedIn: boolean;
    user: any;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, isLoggedIn, user }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (page: Page) => {
        setCurrentPage(page);
        if (router.pathname !== '/') {
            router.push('/');
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-cream text-black">
            <div className="container mx-0 sm:mx-auto">
                <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10 px-5 sm:px-0">
                    <div className="flex justify-start items-center lg:w-0 lg:flex-1">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setCurrentPage(Page.Dashboard);
                                router.push('/');
                            }}
                            style={{
                                width: '160px',
                                height: '40px',
                                background: 'url(/logos/color-horizontal.png) no-repeat',
                                backgroundSize: 'contain'
                            }}
                        />
                    </div>
                    {isLoggedIn && (
                        <>
                            <div className="md:hidden">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center text-gray-900"
                                    onClick={handleMenuClick}
                                >
                                    <MenuOutlined className='w-6 h-6' />
                                </button>
                            </div>
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <button
                                    className="whitespace-nowrap text-base font-medium text-black hover:text-gray-500"
                                    onClick={() => handleMenuItemClick(Page.Dashboard)}
                                >
                                    <HomeOutlined className="mr-2 py-1 align-middle" />My Projects
                                </button>
                                <button
                                    className="ml-8 whitespace-nowrap text-base font-medium text-black hover:text-gray-500"
                                    onClick={() => handleMenuItemClick(Page.PresentationQueue)}
                                >
                                    <FundProjectionScreenOutlined className="mr-2 py-1 align-middle" />Demo Day
                                </button>
                                <button
                                    className="ml-8 whitespace-nowrap text-base font-medium text-black hover:text-gray-500"
                                    onClick={() => handleMenuItemClick(Page.IdentityCenter)}
                                >
                                    <UserOutlined className="mr-2 py-1 align-middle" />Identity Center
                                </button>
                                <button
                                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-cream hover:bg-white"
                                    onClick={() => signOut()}
                                >
                                    <MdLogout className="mr-3 align-middle" />
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isMenuOpen && isLoggedIn && (
                <div className="z-50 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-cream divide-y-2 divide-gray-500">
                        <div className="pt-5 pb-6 px-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <img
                                        className="h-6 sm:h-8 w-auto"
                                        src="/logos/color-horizontal.png"
                                        alt="Logo"
                                    />
                                </div>
                                <div className="-mr-2">
                                    <button
                                        type="button"
                                        className="rounded-md p-2 inline-flex items-center justify-center text-gray-400"
                                        onClick={handleMenuClick}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <CloseOutlined className="flex-shrink-0 h-6 w-6 text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    <button
                                        className="-m-3 p-3 flex items-center rounded-md"
                                        onClick={() => handleMenuItemClick(Page.Dashboard)}
                                    >
                                        <HomeOutlined className="flex-shrink-0 h-6 w-6 text-gray-800" />
                                        <span className="ml-3 text-base font-medium text-gray-700">Profile Home</span>
                                    </button>
                                    <button
                                        className="-m-3 p-3 flex items-center rounded-md"
                                        onClick={() => handleMenuItemClick(Page.PresentationQueue)}
                                    >
                                        <FundProjectionScreenOutlined className="flex-shrink-0 h-6 w-6 text-gray-800" />
                                        <span className="ml-3 text-base font-medium text-gray-700">Demo Day</span>
                                    </button>
                                    <button
                                        className="-m-3 p-3 flex items-center rounded-md"
                                        onClick={() => handleMenuItemClick(Page.IdentityCenter)}
                                    >
                                        <FundProjectionScreenOutlined className="flex-shrink-0 h-6 w-6 text-gray-800" />
                                        <span className="ml-3 text-base font-medium text-gray-700">Identity Center</span>
                                    </button>
                                    <button
                                        className="-m-3 p-3 flex items-center rounded-md"
                                        onClick={() => signOut()}
                                    >
                                        <MdLogout className="flex-shrink-0 h-5 w-5 text-gray-800" />
                                        <span className="ml-4 text-base font-medium text-gray-700">Sign out</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
