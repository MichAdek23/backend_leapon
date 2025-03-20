import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Setting() {
    const { upDatePage, handleToggleState } = useContext(GlobalContext);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here, including file upload
        console.log('Form submitted', selectedFile);
    };

    return (
        <div className="settings-container p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
            <header className="flex p-3 md:p-0 justify-between">
                <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-medium">Settings</h1>
                        <p className="text-base font-medium text-slate-600">Easy Communication with everyone</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <img
                            onClick={() => upDatePage("Message")}
                            src="/image/messageIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt="Message Icon"
                        />
                        <img
                            onClick={() => upDatePage("Setting")}
                            src="/image/settingIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt="Setting Icon"
                        />
                    </div>
                </div>
                <div onClick={handleToggleState} className="block lg:hidden mt-3">
                    <button aria-label="Toggle menu">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                        <input type="text" id="username" name="username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture:</label>
                        <input type="file" id="profilePicture" name="profilePicture" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={handleFileChange} />
                    </div>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-customOrange text-white font-semibold rounded-md shadow-sm focus:outline-none mt-4">Save Changes</button>
            </form>
        </div>
    );
}

export default Setting;