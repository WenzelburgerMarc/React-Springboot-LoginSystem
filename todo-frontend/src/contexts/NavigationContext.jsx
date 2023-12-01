import {useState, createContext, useContext, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const NavigationContext = createContext();

export function useNavigation() {
    return useContext(NavigationContext);
}

export function NavigationProvider({children}) {
    const [navigations, setNavigations] = useState([]);
    const location = useLocation();
    const [showNavigationForAuthedUser, setShowNavigationForAuthedUser] = useState(false);

    useEffect(() => {

        const setNavigationForAuthedUser = () => {
            setShowNavigationForAuthedUser(true);
            return [
                { name: 'Home', href: '/', current: location.pathname === '/' }
            ];
        };

        const setNavigationForUnauthedUser = () => {
            setShowNavigationForAuthedUser(false);
            return [{ name: 'Login/Signup', href: '/auth', current: location.pathname === '/auth' }];
        };

        const user = JSON.parse(localStorage.getItem('user'));
        const initialNavigations = user ? setNavigationForAuthedUser() : setNavigationForUnauthedUser();

        const updatedNavigations = initialNavigations.map(navigation => ({
            ...navigation,
            current: navigation.href === location.pathname
        }));

        setNavigations(updatedNavigations);
    }, [location.pathname]);

    return (
        <NavigationContext.Provider value={{navigations, showNavigationForAuthedUser}}>
            {children}
        </NavigationContext.Provider>
    );
}
