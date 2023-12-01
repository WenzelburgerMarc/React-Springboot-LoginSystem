import { LoginForm } from "../components/LoginForm.jsx";
import { RegisterForm } from "../components/RegisterForm.jsx";
import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { login, signup } from "../helpers/auth_helper.js";
import { useNavigate } from 'react-router';
import { MessageContext } from '../contexts/FlashMessageContext.jsx';

export const AuthPage = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const { showMessage } = useContext(MessageContext);

    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    const variants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 }
    };

    const loginHandler = async (e, username, password) => {
        e.preventDefault();
        try {
            if(!username || !password) throw new Error('Please fill all the fields');
            const res = await login(username, password);
            successfullAuthHandler(res, 'Login Successful!');
        } catch (error) {
            showMessage('Login Failed: ' + error.message, 'error');
        }
    };

    const signupHandler = async (e, name, username, email, password) => {
        e.preventDefault();
        try {
            if(!name || !username || !email || !password) throw new Error('Please fill all the fields');
            const res = await signup(name, username, email, password);
            successfullAuthHandler(res, 'Account Created!');
        } catch (error) {
            showMessage('Signup Failed: ' + error.message, 'error');
        }
    };

    const successfullAuthHandler = (res, successText) => {
        if (res !== undefined) {
            delete res.password;
            localStorage.setItem('user', JSON.stringify(res));
            localStorage.setItem('flashMessage', JSON.stringify({ text: successText, type: 'success' }));
            navigate(0);
        }
    };


    return (
        <div className={"bg-gray-50 dark:bg-gray-900 text-black dark:text-white max-w-full overflow-x-hidden min-h-[calc(100vh_-_64px)]"}>
            <AnimatePresence mode={"wait"}>
                {showLogin ? (
                    <motion.div
                        key="login"
                        variants={variants}
                        initial={isInitialMount ? "" : "initial"}
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <LoginForm loginHandler={loginHandler} setShowLogin={setShowLogin} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        variants={variants}
                        initial={isInitialMount ? "" : "initial"}
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <RegisterForm signupHandler={signupHandler} setShowLogin={setShowLogin} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
