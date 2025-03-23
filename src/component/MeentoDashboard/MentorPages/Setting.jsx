import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

function Setting() {
    const [activeTab, setActiveTab] = useState('basicDetails');
    const { upDatePage, handleToggleState, setProfile } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileDetails, setProfileDetails] = useState({
        fullName: '',
        mentorshipStatus: '',
        gender: '',
        modeOfContact: '',
        availability: '',
        bio: '',
        twitter: '',
        facebook: '',
        whatsapp: '',
        instagram: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileDetails({ ...profileDetails, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setProfileDetails({ ...profileDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            // Add token to request headers
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Make the API call
            const response = await api.post('/mentor/profile/update', profileDetails, config);
            
            // Update the profile in the global state
            setProfile(response.data.profile);
            
            // Show success message
            alert('Profile Updated Successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Error updating profile. Please try again.');
            alert(error.response?.data?.message || 'Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <header className="flex justify-between mb-6">
                <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[32px] font-medium">Settings</h1>
                        <p className="text-base font-medium text-slate-600">Make your Changes</p>
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
            <div className="flex flex-wrap justify-start items-center space-x-4 bg-white py-3 px-3 w-full md:w-fit rounded-md mb-6">
                <button
                    className={`py-2 rounded-lg transition-colors duration-300 px-4 ${activeTab === 'basicDetails' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setActiveTab('basicDetails')}
                >
                    Basic Details
                </button>
                <button
                    className={`py-2 rounded-lg transition-colors duration-300 px-4 ${activeTab === 'Social Media' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setActiveTab('Social Media')}
                >
                    Social Media
                </button>
                <button
                    className={`py-2 rounded-lg transition-colors duration-300 px-4 ${activeTab === 'loginAndSecurity' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setActiveTab('loginAndSecurity')}
                >
                    Login and Security
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {activeTab === 'basicDetails' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Profile Details</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 items-center gap-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={profileDetails.fullName}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mentorship Status</label>
                            <Select className="h-full rounded-xl p-2" onValueChange={(value) => handleSelectChange('mentorshipStatus', value)}>
                                <SelectTrigger className="outline-none w-full border-2 rounded-xl h-[60px]">
                                    <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cordial/Friendly">Cordial/Friendly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Gender</label>
                            <Select className="p-2" onValueChange={(value) => handleSelectChange('gender', value)}>
                                <SelectTrigger className="outline-none w-full border-2 rounded-xl h-[60px]">
                                    <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Male">Male</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mode of Contact</label>
                            <Select className="h-full" onValueChange={(value) => handleSelectChange('modeOfContact', value)}>
                                <SelectTrigger className="outline-none w-full border-2 rounded-xl h-[60px]">
                                    <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Virtual">Virtual</SelectItem>
                                    <SelectItem value="Physical">Physical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Availability</label>
                            <Select className="h-full" onValueChange={(value) => handleSelectChange('availability', value)}>
                                <SelectTrigger className="outline-none w-full border-2 rounded-xl h-[60px]">
                                    <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Available ASAP">Available ASAP</SelectItem>
                                    <SelectItem value="In a few weeks">In a few weeks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1 md:col-span-2 mb-4">
                            <label className="block text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={profileDetails.bio}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                            ></textarea>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button 
                                type="submit" 
                                className="bg-orange-500 text-white py-2 px-4 rounded disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'Social Media' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Social Media</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 items-center gap-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Twitter</label>
                            <input
                                type="text"
                                name="twitter"
                                value={profileDetails.twitter}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                                placeholder="Twitter Handle"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Facebook</label>
                            <input
                                type="text"
                                name="facebook"
                                value={profileDetails.facebook}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                                placeholder="Facebook Profile"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={profileDetails.whatsapp}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                                placeholder="WhatsApp Number"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Instagram</label>
                            <input
                                type="text"
                                name="instagram"
                                value={profileDetails.instagram}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                                placeholder="Instagram Handle"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileDetails.email}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 mt-1"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button 
                                type="submit" 
                                className="bg-orange-500 text-white py-2 px-4 rounded disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'loginAndSecurity' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Login and Security</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={profileDetails.password}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 border-orange-500 mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={profileDetails.confirmPassword}
                                onChange={handleInputChange}
                                className="flex items-center p-2 md:p-4 gap-3 w-full rounded-xl border-2 border-orange-500 mt-1"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-orange-500 text-white py-2 px-4 rounded disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Setting;