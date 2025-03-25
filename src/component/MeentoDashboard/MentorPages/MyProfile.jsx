import React, { useState, useEffect } from 'react';
import { Star, BookOpen, Users } from 'lucide-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRemove } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import EditProfile from './EditProfile'; // Import the EditProfile component
import axios from 'axios'; // Import axios for backend communication
import { useContext } from 'react';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';

// Add icons to the library
library.add(faBars, faRemove, faTwitter, faFacebook, faWhatsapp, faInstagram);

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://leapon.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Don't reject if status is between 200 and 499
  }
});

// Function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/image/young-people-working-from-modern-place 1.png";
  if (imagePath.startsWith('http')) return imagePath;
  
  // For uploaded images
  if (imagePath.startsWith('/uploads') || imagePath.startsWith('/api/uploads')) {
    const cleanPath = imagePath.replace('/api/', '/');
    return `${import.meta.env.VITE_API_URL || 'https://leapon.onrender.com'}${cleanPath}`;
  }
  
  // For static images in the public directory
  return `${import.meta.env.VITE_API_URL || 'https://leapon.onrender.com'}${imagePath}`;
};

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('Response error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error response data:', error.response.data);
    console.error('Error response status:', error.response.status);
    console.error('Error response headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Error request:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
  }
  return Promise.reject(error);
});

const defaultProfile = {
  firstName: '',
  lastName: '',
  role: '',
  email: '',
  mentorshipStatus: '',
  gender: '',
  modeOfContact: '',
  availability: '',
  bio: '',
  overview: '',
  profilePicture: '',
  social: {
    twitter: '',
    facebook: '',
    whatsapp: '',
    instagram: ''
  }
};

const Profile = () => {
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { upDatePage, handleToggleState, acceptedMentees, profile = defaultProfile, setProfile } = useContext(GlobalContext);
  
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First try to get from localStorage for immediate display
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API request to:', api.defaults.baseURL + '/mentor/profile');
      console.log('With token:', token);
      
      // Then fetch fresh data from the server
      const response = await api.get('/mentor/profile');
      console.log('Profile response:', response);
      
      const profileData = response.data;
      setProfile(profileData);
      localStorage.setItem('profile', JSON.stringify(profileData));
    } catch (err) {
      console.error('Error details:', {
        config: err.config,
        response: err.response,
        message: err.message
      });
      setError(err.response?.data?.message || err.message || 'Failed to fetch profile data');
      console.error('Error fetching profile:', err);
      // Set default profile if fetch fails
      if (!profile) {
        setProfile(defaultProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleEditProfile = () => {
    setEditProfileVisible(!isEditProfileVisible);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.currentTarget.src);
    const originalSrc = e.currentTarget.src;
    const name = e.currentTarget.alt;
    
    // Only fallback to UI Avatars if the original image fails and it's not already a UI Avatar
    if (!originalSrc.includes('ui-avatars.com')) {
      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.put('/mentor/profile', updatedProfile);
      const updatedData = response.data;

      setProfile(updatedData);
      localStorage.setItem('profile', JSON.stringify(updatedData));
      setEditProfileVisible(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mentee = [
    {
      name: "Emma Naku",
      image: "https://ui-avatars.com/api/?name=Emma+Naku&background=random",
      role: "Senior Software Engineer"
    },
    {
      name: "Asake Olamide",
      image: "https://ui-avatars.com/api/?name=Asake+Olamide&background=random",
      role: "Product Manager"
    },
    {
      name: "Ruona Obi",
      image: "https://ui-avatars.com/api/?name=Ruona+Obi&background=random",
      role: "UX Designer"
    }
  ];

  return (
    <div className="h-fit bg-gray-50 dark:bg-gray-900 pb-8">
      <header className="flex mt-4 justify-between px-4 mb-8">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-medium">My profile</h1>
            <p className="text-base font-medium text-slate-600">
              {acceptedMentees && acceptedMentees.length > 0
                ? `You have ${acceptedMentees.length} upcoming session${acceptedMentees.length > 1 ? 's' : ''}`
                : 'You have no upcoming sessions'}
            </p>
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
      <div className="container mx-auto px-4 max-w-6xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white pb-8 dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="h-48 rounded-t-xl bg-gradient-to-r from-blue-400 to-blue-600 relative" style={{ backgroundImage: 'url(/image/backImage.png)' }}>
              <div className="absolute -bottom-16 left-8 flex items-end">
                <img
                  src={getImageUrl(profile?.profilePicture)}
                  alt={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                  onError={handleImageError}
                />
              </div>
            </div>
            <div className="pt-20 px-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h1 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold">
                    {profile?.firstName || ''} {profile?.lastName || ''}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.role || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.email || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.mentorshipStatus || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.gender || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.modeOfContact || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.availability || ''}</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.bio || ''}</p>
                  <h2 className="text-xl font-bold mb-4 mt-6">Social Media</h2>
                  <div className="flex gap-4">
                    {profile?.social?.twitter && (
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} className="text-blue-500" />
                        {profile.social.twitter}
                      </a>
                    )}
                    {profile?.social?.facebook && (
                      <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} className="text-blue-700" />
                      </a>
                    )}
                    {profile?.social?.whatsapp && (
                      <a href={profile.social.whatsapp} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" />
                      </a>
                    )}
                    {profile?.social?.instagram && (
                      <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className="text-pink-500" />
                        {profile.social.instagram}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  className="text-orange-500 hover:text-orange-600 font-medium"
                  onClick={toggleEditProfile}
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-8 flex gap-8">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sessions completed</p>
                    <p className="font-semibold">25</p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <h2 className="text-lg font-semibold mb-4">My Mentees</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mentee.map((mentee, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentee.image}
                          alt={mentee.name}
                          className="w-12 h-12 rounded-full"
                          onError={handleImageError}
                        />
                        <div>
                          <h3 className="font-semibold">{mentee.name}</h3>
                          <p className="text-sm text-gray-500">{mentee.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 bg-slate-200 px-8 py-8 rounded-3xl">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                    {profile?.overview || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditProfileVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="dark:bg-gray-800 bg-white p-2 lg:w-fit border rounded-2xl shadow-lg">
            <button onClick={toggleEditProfile} className="bg-customOrange bg-opacity-50 h-6 w-6 rounded-full float-right">
              <FontAwesomeIcon className='text-slate-50' icon={faRemove} />
            </button>
            <EditProfile profile={profile} onUpdate={handleProfileUpdate} setIsEditProfileVisible={setEditProfileVisible} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;