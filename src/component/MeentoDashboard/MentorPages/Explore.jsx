import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import { useAuth } from '../../../lib/AuthContext';
import { userApi } from '../../../lib/api';

function Explore() {
  const { upDatePage, handleToggleState, setSelectedMentee, AddMentees, acceptedMentees } =
    useContext(GlobalContext);
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [applySearch, setApplySearch] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await (user?.role === 'mentor' ? userApi.getMentees() : userApi.getMentors());
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.role]);

  // Filter users based on search input and acceptedMentees
  const filteredData = users
    .filter((item) => !acceptedMentees.some((mentee) => mentee.id === item._id))
    .filter((item) =>
      applySearch
        ? inputSearch
          ? item.name.toLowerCase().includes(inputSearch.toLowerCase()) ||
            item.email.toLowerCase().includes(inputSearch.toLowerCase()) ||
            (item.expertise && item.expertise.some(skill => 
              skill.toLowerCase().includes(inputSearch.toLowerCase())
            ))
          : true
        : true
    );

  const handleSearch = () => {
    setApplySearch(true);
  };

  const handleBookingNavigation = async (selectedUser) => {
    try {
      // Create a new session
      const sessionData = {
        mentor: user.role === 'mentor' ? user.userId : selectedUser._id,
        mentee: user.role === 'student' ? user.userId : selectedUser._id,
        date: new Date().toISOString(),
        duration: 60,
        topic: 'Initial Mentorship Session',
        type: 'one-on-one',
        status: 'scheduled'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create session');
      }

      const session = await response.json();

      // Create a new conversation
      const conversationResponse = await fetch(`${import.meta.env.VITE_API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          otherUserId: selectedUser._id
        })
      });

      if (!conversationResponse.ok) {
        throw new Error('Failed to create conversation');
      }

      const conversation = await conversationResponse.json();

      // Store the selected user, session, and conversation in local storage
      localStorage.setItem('mentee', JSON.stringify(selectedUser));
      localStorage.setItem('session', JSON.stringify(session));
      localStorage.setItem('conversation', JSON.stringify(conversation));

      // Update the UI state
      setSelectedMentee(selectedUser);
      AddMentees(selectedUser);

      // Navigate to the booking page
      upDatePage('Booking');
    } catch (error) {
      console.error('Error creating connection:', error);
      // Show error message to user
      alert(error.message || 'Failed to create connection. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!users || users.length === 0) {
    return <div className="text-4xl flex justify-center items-center h-96">
      No {user?.role === 'mentor' ? 'mentees' : 'mentors'} available
    </div>;
  }

  return (
    <section className="p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">
              {user?.role === 'mentor' ? 'Mentees' : 'Mentors'}
            </h1>
            <p className="text-base font-medium text-slate-600">
              {user?.role === 'mentor' ? 'Connect with Mentees' : 'Find a Mentor'}
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

      {/* Main Content */}
      <div className="relative z-20 h-fit">
        <section className="mt-11 w-full flex flex-col md:flex-row lg:flex-nowrap gap-5 h-14 justify-center">
          <p className="absolute z-20 left-9 hidden md:block md:bottom-11 text-slate-400 bg-slate-100">
            search
          </p>
          <div className="md:w-[89%] md:h-full rounded-lg md:rounded-3xl px-3 py-3 md:py-0 md:px-6 border-2">
            <input
              type="text"
              placeholder={`Search by name, ${user?.role === 'student' ? 'department, year' : 'expertise, experience'}`}
              className="w-full outline-none h-full bg-transparent"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              aria-label={`Search ${user?.role === 'mentor' ? 'mentees' : 'mentors'}`}
            />
          </div>
          <div onClick={handleSearch} className="h-full cursor-pointer flex justify-center items-center rounded-2xl bg-customOrange py-6 md:py-2 md:w-[12%]">
            <button className="text-base font-bold text-white">
              {user?.role === 'mentor' ? 'Find Mentee' : 'Find Mentor'}
            </button>
          </div>
        </section>
      </div>

      {/* User Cards */}
      <section className="h-fit cursor-pointer mt-24 md:mt-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-4">
        {filteredData.map((user) => (
          <div
            key={user._id}
            className="border-2 rounded-lg w-full h-[400px] lg:w-fit md:h-fit bg-white"
          >
            <div className="h-1/2 w-full md:h-3/5">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                className="h-full w-full object-cover"
                alt={user.name}
                loading="lazy"
              />
            </div>
            <div className="h-1/2 md:h-2/5 p-6">
              <h3 className="text-lg font-bold text-customDarkBlue">
                {user.name}
              </h3>
              <p className="flex items-center text-xs text-customDarkBlue font-normal">
                <span>
                  <img
                    src="/image/tick.png"
                    className="object-cover h-4 w-4"
                    alt="Verified"
                  />
                </span>
                {user.email}
              </p>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-1">
                  {user.role === 'student' ? (
                    <>
                      <p className="text-xs p-2 rounded-lg bg-slate-200">
                        Department: {user.department}
                      </p>
                      <p className="text-xs p-2 rounded-lg bg-slate-200">
                        Year: {user.yearOfStudy}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs p-2 rounded-lg bg-slate-200">
                        Experience: {user.experience}
                      </p>
                      <p className="text-xs p-2 rounded-lg bg-slate-200">
                        Expertise: {user.expertise?.join(', ')}
                      </p>
                    </>
                  )}
                </div>
                <div 
                  onClick={() => handleBookingNavigation(user)} 
                  className="px-8 bg-customOrange py-3 cursor-pointer rounded-xl text-base font-medium text-white hover:bg-orange-600 transition-colors"
                >
                  <button>
                    {user.role === 'student' ? 'Connect with Mentee' : 'Connect with Mentor'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

export default Explore;