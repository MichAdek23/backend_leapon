import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function MyProfile() {
    const { upDatePage, handleToggleState } = useContext(GlobalContext);
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
            <header className="flex justify-between">
                <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-medium">My Profile</h1>
                        <p className="text-base font-medium text-slate-600">Tell us about yourself</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <img
                            onClick={() => upDatePage("Message")}
                            src="/image/messageIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt="Message Icon"
                            loading="lazy"
                        />
                        <img
                            onClick={() => upDatePage("Setting")}
                            src="/image/settingIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt="Setting Icon"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div onClick={handleToggleState} className="block lg:hidden mt-3">
                    <button aria-label="Toggle menu">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
            </header>

            <section className="mt-20">
                <div className="relative">
                    <div className="rounded-lg overflow-hidden h-40">
                        <img src="/image/backImage.png" loading="lazy" className="w-full h-full object-cover" alt="Background" />
                    </div>
                    <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
                        <img src="/image/profileImage.png" className="w-32 h-32 rounded-full border-4 border-white" alt="Profile" />
                    </div>
                </div>
                <div className="mt-20 text-center">
                    <h2 className="text-xl font-semibold">John Doe</h2>
                    <p className="text-gray-600">Mentor</p>
                </div>
                <div className="mt-10">
                    <h3 className="text-lg font-medium">About Me</h3>
                    <p className="mt-2 text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                    </p>
                </div>
                <div className="mt-10">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <p className="mt-2 text-gray-700">Email: johndoe@example.com</p>
                    <p className="mt-2 text-gray-700">Phone: (123) 456-7890</p>
                </div>
            </section>
        </div>
    );
}

export default MyProfile;