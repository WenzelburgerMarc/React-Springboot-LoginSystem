import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const signIn = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const signOut = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const isLoggedIn = () => {
        return user !== null;
    };

    return (
        <UserContext.Provider value={{ user, signIn, signOut, isLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
}
