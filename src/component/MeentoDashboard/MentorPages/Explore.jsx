import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faUserGraduate, faUserTie, faStar } from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import { useAuth } from '../../../lib/AuthContext';
import { userApi } from '../../../lib/api';

function Explore() {
  const { upDatePage, handleToggleState, setSelectedMentee, AddMentees, acceptedMentees, setSelectedChatUser } =
    useContext(GlobalContext);
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // If user is a mentor, fetch mentees, if user is a mentee, fetch mentors
        const response = await (user?.role === 'mentor' ? userApi.getMentees() : userApi.getMentors());
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchUsers();
    }
  }, [user?.role]);

  // Filter users based on search query and acceptedMentees
  const filteredUsers = users
    .filter((item) => !acceptedMentees.some((mentee) => mentee.id === item._id))
    .filter((item) =>
      searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.expertise && item.expertise.some(skill => 
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        : true
    );

  const handleStartChat = async (selectedUser) => {
    try {
      // Create a new conversation
      const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          participantId: selectedUser._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      // Store the selected user and update state
      setSelectedMentee(selectedUser);
      AddMentees(selectedUser);
      
      // Set the selected chat user in GlobalContext
      setSelectedChatUser(selectedUser);

      // Navigate to messages
      upDatePage('Message');
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Show error to user
      setError('Failed to start chat. Please try again.');
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <p className="text-lg font-medium">Error loading users</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="flex justify-between mb-8">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">
              {user?.role === 'mentor' ? 'Find Mentees' : 'Find Mentors'}
            </h1>
            <p className="text-base font-medium text-slate-600">
              {user?.role === 'mentor' ? 'Connect with potential mentees' : 'Find your perfect mentor'}
            </p>
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

      {/* Search Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={`Search by name, ${user?.role === 'student' ? 'department, year' : 'expertise, experience'}`}
            className="w-full pl-12 pr-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No {user?.role === 'mentor' ? 'mentees' : 'mentors'} found matching your search
            </p>
          </div>
        ) : (
          filteredUsers.map((userData) => (
            <div
              key={userData._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* User Image */}
              <div className="relative h-48">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2">
                  <FontAwesomeIcon
                    icon={userData.role === 'student' ? faUserGraduate : faUserTie}
                    className="text-orange-500"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userData.name}
                  </h3>
                  <div className="flex items-center text-yellow-400">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span className="text-sm">5.0</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {userData.email}
                </p>

                {/* Role-specific information */}
                <div className="space-y-2 mb-6">
                  {userData.role === 'student' ? (
                    <>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Department:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{userData.department}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Year:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{userData.yearOfStudy}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{userData.experience} years</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userData.expertise?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartChat(userData)}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Explore;