import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserDetails } from './UserDetails.jsx';
import { ComingSoon } from './ComingSoon.jsx';

export const HomePageTabs = () => {
    const [activeTab, setActiveTab] = useState('userDetails');

    const tabs = {
        userDetails: {
            component: UserDetails,
            header: 'User Details',
        },
        myTasks: {
            component: ComingSoon,
            header: 'Coming Soon',
        },

    };

    const TabComponent = tabs[activeTab].component;

    return (
        <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 sm:max-w-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {Object.keys(tabs).map((tabKey) => (
                        <li key={tabKey} className="me-2">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(tabKey);
                                }}
                                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${activeTab === tabKey ? 'text-blue-600 border-blue-600' : 'border-transparent'}`}
                            >
                                {tabs[tabKey].header}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <AnimatePresence mode={"wait"}>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <TabComponent />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
