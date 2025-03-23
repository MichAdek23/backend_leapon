import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userApi } from '@/lib/api';

// Function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/image/Subtract.png";
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    // For uploaded images, use the full API URL
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  if (imagePath.startsWith('/api/uploads')) {
    // Handle legacy paths that incorrectly include /api
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath.replace('/api', '')}`;
  }
  // For static images in the public directory
  return imagePath;
};

const EditProfile = ({ profile, onUpdate, setIsEditProfileVisible }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({
    fullName: profile?.fullName || '',
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    profilePicture: profile?.profilePicture || '',
    interests: profile?.interests || '',
    linkedIn: profile?.linkedIn || '',
    twitter: profile?.twitter || '',
    instagram: profile?.instagram || '',
    website: profile?.website || '',
    overview: profile?.overview || '',
    email: profile?.email || '',
    availability: profile?.availability || '',
    modeOfContact: profile?.modeOfContact || '',
    gender: profile?.gender || '',
    relationshipStatus: profile?.relationshipStatus || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) { // 12MB limit
        alert('File size must be less than 12MB');
        return;
      }

      try {
        // Create FormData object to send file
        const formData = new FormData();
        formData.append('profilePicture', file);

        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        // Use userApi instance for consistent API handling
        const response = await userApi.uploadProfilePicture(formData);
        console.log('Upload successful:', response);
        setUpdatedProfile(prev => ({ ...prev, profilePicture: response.data.imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setError(error.message || 'Failed to upload image. Please try again.');
        alert(error.message || 'Failed to upload image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove undefined or empty string values
      const profileData = Object.fromEntries(
        Object.entries(updatedProfile).filter(([, value]) => value !== undefined && value !== '')
      );

      const response = await userApi.updateProfile(profileData);
      onUpdate(response.data);
      setIsEditProfileVisible(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicProfile = () => (
    <>
      <div>
        <p className='mt-5 text-lg font-medium text-cyan-600'>Upload profile photo*</p>
        <div className='flex flex-col lg:flex-row items-center cursor-pointer mt-5 gap-3'>
          <div className='h-[75px] w-[75px] rounded-full flex justify-center items-center bg-slate-600 font-medium text-blue-950'>
            {updatedProfile && updatedProfile.profilePicture ? (
              <img src={getImageUrl(updatedProfile.profilePicture)} className='h-full w-full rounded-full' alt="" />
            ) : (
              <img src="/image/Subtract.png" className='object-contain rounded-full' alt="Fallback Profile" />
            )}
          </div>
          <div>
            <input type="file" name="image" className='bg-white' onChange={handleImageUpload} accept="image/*" />
            <p>Make sure the file is below 12MB</p>
          </div>
        </div>
      </div>
      <div className="profile-section grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center w-full justify-center gap-3">
              <input
                type="text"
                className="outline-none w-full"
                name="fullName"
                value={updatedProfile.fullName}
                onChange={handleChange}
                placeholder="Enter Full Name"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
                Full Name
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center w-full justify-center gap-3">
              <input
                type="text"
                className="outline-none w-full"
                name="firstName"
                value={updatedProfile.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
                First Name
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center w-full justify-center gap-3">
              <input
                type="text"
                className="outline-none w-full"
                name="lastName"
                value={updatedProfile.lastName || ''}
                onChange={handleChange}
                placeholder="Enter Last Name"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
                Last Name
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
            <div className="relative flex items-center w-full justify-center gap-3">
              <input
                type="email"
                className="outline-none w-full"
                name="email"
                value={updatedProfile.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
              <p className="absolute -top-7 left-2 bg-white px-1 text-base font-bold text-slate-400">
                Email
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border-2">
        <div className="relative flex items-center w-full justify-center gap-3">
          <textarea
            name="overview"
            value={updatedProfile.overview}
            onChange={handleChange}
            placeholder="Tell About yourself"
            className='w-full outline-none px-4 py-2 h-[110px]'
          />
          <p className="absolute -top-4 left-2 bg-white px-1 text-base font-bold text-slate-400">
            Overview
          </p>
        </div>
      </div>
    </>
  );

  const renderMentorPreference = () => (
    <div className="profile-section grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <Select onValueChange={(value) => handleSelectChange('availability', value)}>
              <SelectTrigger className="outline-none w-full">
                <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available ASAP">Available ASAP</SelectItem>
                <SelectItem value="In a few weeks">In a few weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Mode of contact</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <Select onValueChange={(value) => handleSelectChange('modeOfContact', value)}>
              <SelectTrigger className="outline-none w-full">
                <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Virtual">Virtual</SelectItem>
                <SelectItem value="Chat">Chat</SelectItem>
                <SelectItem value="Physical">Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <Select onValueChange={(value) => handleSelectChange('gender', value)}>
              <SelectTrigger className="outline-none w-full">
                <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Relationship Status</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <Select onValueChange={(value) => handleSelectChange('relationshipStatus', value)}>
              <SelectTrigger className="outline-none w-full">
                <SelectValue className="text-lg text-slate-500" placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Interests</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <input
              type="text"
              name="interests"
              value={updatedProfile.interests}
              onChange={handleChange}
              className="outline-none w-full"
              placeholder="Career guidance, Academics"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="profile-section grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <input
              type="text"
              name="linkedIn"
              value={updatedProfile.linkedIn}
              onChange={handleChange}
              className="outline-none w-full"
              placeholder="LinkedIn"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Twitter Profile URL</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <input
              type="text"
              name="twitter"
              value={updatedProfile.twitter}
              onChange={handleChange}
              className="outline-none w-full"
              placeholder="Twitter"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Instagram Profile URL</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <input
              type="text"
              name="instagram"
              value={updatedProfile.instagram}
              onChange={handleChange}
              className="outline-none w-full"
              placeholder="EmmanuellaBernard"
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700">Website URL</label>
        <div className="mt-4 flex items-center p-2 md:p-4 justify-between gap-3 w-full rounded-xl border-2">
          <div className="relative flex items-center w-full justify-center gap-3">
            <input
              type="text"
              name="website"
              value={updatedProfile.website}
              onChange={handleChange}
              className="outline-none w-full"
              placeholder="Emmanuella.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 mx-auto">
      <h1 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold">
        {profile.firstName || profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : profile.fullName}
      </h1>
      <p className='mb-10 text-sm text-slate-600 font-medium'>Update your profile details</p>
      <div className="tab-buttons flex border-b-2 mb-4">
        <button 
          type="button" 
          className={`${activeTab === 'basic' ? 'border-b-2 border-customOrange' : 'border-0'} transition-colors duration-300 px-4 py-2`} 
          onClick={() => setActiveTab('basic')}
        >
          Basic Profile
        </button>
        <button 
          type="button" 
          className={`${activeTab === 'social' ? 'border-b-2 border-customOrange' : 'border-0'} transition-colors duration-300 px-4 py-2`} 
          onClick={() => setActiveTab('social')}
        >
          Social Links
        </button>
        <button 
          type="button" 
          className={`${activeTab === 'mentor' ? 'border-b-2 border-customOrange' : 'border-0'} transition-colors duration-300 px-4 py-2`} 
          onClick={() => setActiveTab('mentor')}
        >
          Mentor Preference
        </button>
      </div>
      {activeTab === 'basic' && renderBasicProfile()}
      {activeTab === 'mentor' && renderMentorPreference()}
      {activeTab === 'social' && renderSocialLinks()}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <button 
        type="submit" 
        className="bg-customOrange mt-5 text-white py-2 px-4 rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default EditProfile;