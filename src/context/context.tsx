import { ReactNode, createContext, useState, useContext } from "react";
import { Page } from "../models/models";

type GameheadsIdContextType = {
    setCurrentPage: (page: Page) => void;
    currentPage: Page;
    user: any;
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    setUser: (user: any) => void;
};

const gameheadsIdContextDefault: GameheadsIdContextType = {
    setCurrentPage: () => {},
    currentPage: Page.Dashboard,
    user: null,
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    setUser: () => {},
};

const GameheadsIdContext = createContext<GameheadsIdContextType>(gameheadsIdContextDefault);

export function useGameheadsContext() {
    return useContext(GameheadsIdContext);
}

type Props = {
    children: ReactNode;
};

export function GameheadsIdProvider({ children }: Props) {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    return (
        <GameheadsIdContext.Provider value= {{ currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn, user, setUser }}>
            { children }
        </GameheadsIdContext.Provider>
    );
}
