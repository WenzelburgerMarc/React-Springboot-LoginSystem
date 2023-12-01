import {useState, useEffect, useContext} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {updateAccount} from "../helpers/auth_helper.js";
import { MessageContext } from '../contexts/FlashMessageContext.jsx';

export const UserDetails = () => {
    const { showMessage } = useContext(MessageContext);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editUser, setEditUser] = useState({
        name: '',
        newUsername: '',
        newEmail: '',
        oldUsername: '',
        oldEmail: '',
        oldPassword: '',
        newPassword: '',
        newConfirmPassword: '',
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
            setEditUser({
                ...editUser,
                name: parsedUser.name,
                newUsername: parsedUser.username,
                newEmail: parsedUser.email,
                oldUsername: parsedUser.username,
                oldEmail: parsedUser.email,
            });
        }

        document.addEventListener('mousedown', handleClickOutside);

    }, []);

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('fixed')) {
            setIsModalOpen(false);
        }
    };

    const handleInputChange = (e) => {
        setEditUser({...editUser, [e.target.name]: e.target.value});
    };

    const handleUpdate = async () => {
        try {
            let updatedUser = editUser;
            let jwtToken = JSON.parse(localStorage.getItem('user')).token;

            updatedUser.token = jwtToken;

            const res = await updateAccount(updatedUser);
            setUser({
                name: res.name,
                username: res.username,
                email: res.email,
                token: res.token,
            });

            setIsModalOpen(false)

        } catch (error) {
            showMessage('Editing account failed: ' + error.message, 'error');
        }
    };

    return (
        <div className="p-4 sm:p-6 overflow-hidden">
            <table className="w-full table-auto overflow-hidden mb-4">
                <thead className="text-left">
                <tr className="border-b">
                    <th className="pb-2 font-semibold">Name</th>
                    <th className="pb-2 font-semibold">Username</th>
                    <th className="pb-2 font-semibold">E-Mail</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="pt-2 max-w-xs">
                        <div className="truncate">{user?.name || 'N/A'}</div>
                    </td>
                    <td className="pt-2 max-w-xs">
                        <div className="truncate">@{user?.username || 'N/A'}</div>
                    </td>
                    <td className="pt-2 max-w-xs">
                        <div className="truncate">{user?.email || 'N/A'}</div>
                    </td>
                </tr>
                </tbody>
            </table>

            <div className={"w-full flex justify-end items-center"}>
                <p className={"text-sm text-gray-400 mr-auto"}>Click the button on the right to change your account
                    information.</p>
                <button
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Edit
                </button>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
                    >
                        <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm">
                            {/* Name */}
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="Name"
                                name="name"
                                value={editUser.name}
                                onChange={handleInputChange}
                            />

                            {/* Username */}
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">New Username</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="New Username"
                                name="newUsername"
                                value={editUser.newUsername}
                                onChange={handleInputChange}
                            />

                            <label className="hidden">Old Username</label>
                            <input
                                type="hidden"
                                name="oldUsername"
                                value={editUser.oldUsername}
                            />

                            {/* Email */}
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">New Email</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="New Email"
                                name="newEmail"
                                value={editUser.newEmail}
                                onChange={handleInputChange}
                            />

                            <label className="hidden">Old Email</label>
                            <input
                                type="hidden"
                                name="oldEmail"
                                value={editUser.oldEmail}
                            />

                            {/* Old PW */}
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Old
                                Password</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="Old Password"
                                type="password"
                                name="oldPassword"
                                value={editUser.oldPassword}
                                onChange={handleInputChange}
                            />

                            {/* PW */}
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">New
                                Password</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="New Password"
                                type="password"
                                name="newPassword"
                                value={editUser.newPassword}
                                onChange={handleInputChange}
                            />

                            {/* New Confirm PW */}
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Confirm
                                New Password</label>
                            <input
                                className="w-full mb-3 p-2 border border-gray-500 rounded dark:bg-gray-900"
                                placeholder="Confirm New Password"
                                type="password"
                                name="newConfirmPassword"
                                value={editUser.newConfirmPassword}
                                onChange={handleInputChange}
                            />
                            {/* Buttons */}
                            <div className="flex justify-between">
                                <button
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
