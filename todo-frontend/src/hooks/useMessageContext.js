import { useContext } from 'react';
import { MessageContext } from '../contexts/FlashMessageContext.jsx';

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
}
