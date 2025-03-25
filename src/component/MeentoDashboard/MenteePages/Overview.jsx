import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLongArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "@/components/ui/calendar";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import { userApi } from '../../../lib/api';
import { useAuth } from '../../../lib/AuthContext';

function Overview() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { upDatePage, handleToggleState, acceptedMentors } = useContext(GlobalContext);

  // Calculate profile completion percentage
  const calculateProfileStrength = () => {
    if (!user) return 0;

    const requiredFields = {
      name: 1,
      email: 1,
      overview: 1,
      interests: 1,
      department: 1,
      yearOfStudy: 1,
    };

    const totalFields = Object.keys(requiredFields).length;
    let completedFields = 0;

    // Count completed fields
    Object.keys(requiredFields).forEach(field => {
      if (user[field] && (Array.isArray(user[field]) ? user[field].length > 0 : true)) {
        completedFields++;
      }
    });

    return Math.round((completedFields / totalFields) * 100);
  };

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await userApi.getMentors();
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'mentee') {
      fetchMentors();
    }
  }, [user?.role]);

  return (
    <section className="p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Welcome</h1>
            <p className="text-base font-medium text-slate-600">
              {acceptedMentors && acceptedMentors.length > 0 
                ? `You have ${acceptedMentors.length} upcoming session${acceptedMentors.length > 1 ? 's' : ''}`
                : 'You have no upcoming sessions'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <img
              onClick={() => upDatePage("Message")}
              src="/image/messageIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt=""
              loading="lazy"
            />
            <img
              onClick={() => upDatePage("Setting")}
              src="/image/settingIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt=""
              loading="lazy"
            />
          </div>
        </div>

        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="mt-11 flex flex-wrap lg:flex-nowrap gap-5 justify-center">
        {/* Profile Strength Section */}
        <div className="py-4 px-2 md:px-4 lg:px-5 rounded-lg bg-white shadow-2xl lg:w-[33%]">
          <div className="flex justify-between">
            <h1 className="md:text-lg lg:text-2xl font-medium">Your profile strength</h1>
          </div>
          <div className="mt-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Profile Completion</span>
              <span className="text-sm font-medium">{calculateProfileStrength()}%</span>
            </div>
            <progress 
              className="h-2 w-full" 
              value={calculateProfileStrength()} 
              max="100"
            ></progress>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white shadow-2xl rounded-lg md:w-[40%] lg:w-[33%]">
          <Calendar
            mode="single"
            className="rounded-lg w-full h-full"
          />
        </div>

        {/* Upcoming Sessions Section */}
        <div className="bg-white p-5 shadow-2xl rounded-lg md:w-[40%] lg:w-[33%]">
          <h2 className="text-lg font-medium mb-4">Upcoming Sessions</h2>
          {acceptedMentors && acceptedMentors.length > 0 ? (
            <div className="space-y-4">
              {acceptedMentors.map((mentor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">Mentor</p>
                    </div>
                  </div>
                  <button className="text-customOrange hover:text-orange-600">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming sessions</p>
          )}
        </div>
      </section>

      {/* Mentors Section */}
      <section className="rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-5 mt-12">
        {loading ? (
          <div>Loading...</div>
        ) : (
          mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="border-2 rounded-lg overflow-hidden w-[99%] h-[420px] bg-white"
            >
              <div className="h-3/5">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`}
                  className="h-full w-full object-cover"
                  alt={mentor.name}
                  loading="lazy"
                />
              </div>
              <div className="h-2/5 flex flex-col gap-2 p-6">
                <h3 className="text-lg font-bold text-customDarkBlue">
                  {mentor.name}
                </h3>
                <p className="flex items-center text-xs text-customDarkBlue font-normal">
                  <span>
                    <img
                      src="/image/tick.png"
                      className="object-cover h-4 w-4"
                      alt=""
                    />
                  </span>
                  {mentor.email}
                </p>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-1">
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Expertise: {mentor.expertise}
                    </p>
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Experience: {mentor.experience}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </section>
  );
}

export default Overview; 