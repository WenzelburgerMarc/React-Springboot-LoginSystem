import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthPage} from "./pages/AuthPage.jsx";
import {HomePage} from "./pages/HomePage.jsx";
import {UserProvider, useUser} from "./contexts/UserContext.jsx";
import {NavigationProvider} from "./contexts/NavigationContext.jsx";
import {Layout} from "./layouts/Layout.jsx";
import {MessageProvider} from './contexts/FlashMessageContext.jsx';
import FlashMessage from './components/FlashMessage.jsx';

function ProtectedRoute({children}) {
    const {user} = useUser();
    return user ? children : <Navigate to="/auth" replace/>;
}

function PublicRoute({children}) {
    const {user} = useUser();
    return user ? <Navigate to="/" replace/> : children;
}

function App() {
    return (
        <MessageProvider>
            <FlashMessage/>
            <UserProvider>
                <BrowserRouter>
                    <NavigationProvider>
                        <Routes>
                            <Route path="/" element={<Layout/>}>
                                <Route index  element={
                                    <ProtectedRoute>
                                        <HomePage/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="auth" element={
                                    <PublicRoute>
                                        <AuthPage/>
                                    </PublicRoute>
                                }/>
                                <Route path="*" element={
                                    <ProtectedRoute>
                                        <HomePage/>
                                    </ProtectedRoute>
                                }/>
                            </Route>
                        </Routes>
                    </NavigationProvider>
                </BrowserRouter>
            </UserProvider>
        </MessageProvider>
    );
}

export default App;
