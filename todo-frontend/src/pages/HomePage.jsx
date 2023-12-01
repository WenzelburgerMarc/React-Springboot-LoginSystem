import {useContext, useEffect} from 'react';
import {MessageContext} from '../contexts/FlashMessageContext.jsx';
import {HomePageTabs} from '../components/HomePageTabs.jsx';

export const HomePage = () => {
    const {showMessage} = useContext(MessageContext);

    useEffect(() => {

        const storedMessage = localStorage.getItem('flashMessage');
        if (storedMessage) {
            const message = JSON.parse(storedMessage);
            showMessage(message.text, message.type);
            localStorage.removeItem('flashMessage');
        }
    }, [showMessage]);

    return (
        <>
            <div
                className={"bg-gray-50 dark:bg-gray-900 text-black dark:text-white max-w-full overflow-x-hidden min-h-[calc(100vh_-_64px)]"}>
                <div
                    className="flex flex-col items-center justify-start px-4 py-6 mx-auto md:h-[calc(100vh_-_64px)] lg:px-8">
                    <HomePageTabs />
                </div>
            </div>
        </>
    )
}
