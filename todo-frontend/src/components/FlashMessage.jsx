import { useContext, useEffect } from 'react';
import { MessageContext } from '../contexts/FlashMessageContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const FlashMessage = () => {
    const { message, setMessage } = useContext(MessageContext);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                try{
                    setMessage(null);
                }catch (e){}
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const messageTypeStyles = {
        success: {
            titleBg: 'bg-green-500',
            border: 'border-green-400',
            bg: 'bg-green-100',
            text: 'text-green-700'
        },
        info: {
            titleBg: 'bg-blue-500',
            border: 'border-blue-400',
            bg: 'bg-blue-100',
            text: 'text-blue-700'
        },
        error: {
            titleBg: 'bg-red-500',
            border: 'border-red-400',
            bg: 'bg-red-100',
            text: 'text-red-700'
        }
    };

    const styles = messageTypeStyles[message?.type] || messageTypeStyles.error;

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-4 right-4 z-[1000]"
                    role="alert"
                    key={message.text}
                >
                    <div className={`${styles.titleBg} text-white font-bold rounded-t px-4 py-2`}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                    </div>
                    <div className={`${styles.border} border border-t-0 ${styles.bg} rounded-b px-4 py-3 ${styles.text}`}>
                        <p>{message.text}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FlashMessage;
