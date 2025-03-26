import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLongArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "@/components/ui/calendar";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import { userApi, sessionApi } from '../../../lib/api';
import { useAuth } from '../../../lib/AuthContext';

function Overview() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const { upDatePage, handleToggleState, acceptedMentees } = useContext(GlobalContext);

  // Calculate profile completion percentage based on complete profile data
  const calculateProfileStrength = () => {
    if (!user) return 0;

    const requiredFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
      bio: 1,
      interests: 1,
      title: 1,
      socialMediaLinks: 1,
      profilePicture: 1,
      gender: 1,
      expertise: 1,
      experience: 1
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
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch mentees
        const menteesResponse = await userApi.getMentees();
        setMentees(menteesResponse.data);

        // Fetch user stats
        const statsResponse = await userApi.getStats();
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'mentor') {
      fetchData();
    }
  }, [user?.role]);

  const Title = [
    "#1 Tips for Success",
    "#2 Tips for Success",
    "#3 Tips for Success",
    "#4 Tips for Success",
  ];
  const Heading = [
    "How to prepare for your first meeting",
    "What should we talk about during our meeting?",
    "Be on time!",
    "After the session, stay connected!",
  ];
  const Message = [
    "Plan an agenda! Plan out the questions and topics you'd like to discuss. If you'd like to work together on long-term goals, set some time to discuss expectations for each other.",
    "Learn about each other's backgrounds to see if there's a fit. You can discuss your goals, challenges, recent successes, or a specific topic you need help with - it's up to you.",
    "You will receive multiple reminders for your session, don't be late! Get off to a good start by showing up on time.",
    "After your session, don't be a stranger! Keep your mentor updated on your progress - they are more invested in your success than you think!",
  ];

  const [index, setIndex] = useState(0);
  const [date, setDate] = useState(new Date());

  const nextMessage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % Title.length);
  };

  const prevMessage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + Title.length) % Title.length);
  };

  return (
    <section className="p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Welcome, {user?.firstName || 'Mentor'}</h1>
            <p className="text-base font-medium text-slate-600">
              {stats?.upcomingSessions > 0 
                ? `You have ${stats.upcomingSessions} upcoming session${stats.upcomingSessions > 1 ? 's' : ''}`
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

            <button 
              onClick={() => upDatePage("MyProfile")}
              className="h-[30px] w-[30px] flex justify-center items-center bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
            >
              <FontAwesomeIcon icon={faLongArrowRight} />
            </button>
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

          <div className="mt-5 border-2 border-gray-100 w-full"></div>
          <div className="mt-5 flex justify-between">
            <h1 className="text-base lg:text-lg text-gray-500 font-medium">
              Complete your 1st Mentorship Sessions Milestone
            </h1>

            <button className="h-[30px] w-[50px] flex justify-center items-center bg-slate-200 rounded-full">
              <FontAwesomeIcon icon={faLongArrowRight} />
            </button>
          </div>

          <div className="mt-3">
            <progress className="h-2 w-full" value={stats?.totalSessions || 0} max="100"></progress>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-lg md:w-[40%] lg:w-[33%]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg w-full h-full"
          />
        </div>

        <div className="bg-white p-5 shadow-2xl rounded-lg md:w-[40%] lg:w-[33%] flex flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <div>
                <h1 className="md:text-lg font-medium text-gray-600">{Title[index]}</h1>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevMessage}
                  className="h-[30px] w-[30px] flex justify-center items-center bg-slate-200 rounded-full"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <button
                  onClick={nextMessage}
                  className="h-[30px] w-[30px] flex justify-center items-center bg-slate-200 rounded-full"
                >
                  <FontAwesomeIcon icon={faLongArrowRight} />
                </button>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-2">{Heading[index]}</h2>
            <p className="text-sm md:text-lg text-gray-500 mt-2">{Message[index]}</p>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex justify-between">
          <h1 className="text-base md:text-[22px] font-medium text-customDarkBlue">Your top matches</h1>
          <button onClick={() => upDatePage('Explore')} className="p-2 md:p-0 h-10 rounded-xl md:w-40 text-white bg-customOrange flex justify-center items-center">
            Explore Mentees
          </button>
        </div>
      </section>

      <section className="rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-5 mt-12">
        {loading ? (
          <div>Loading...</div>
        ) : (
          mentees.map((mentee) => (
            <div
              onClick={() => upDatePage("Explore")}
              key={mentee._id}
              className="border-2 rounded-lg overflow-hidden cursor-pointer w-[99%] h-[420px] bg-white"
            >
              <div className="h-3/5">
                <img
                  src={mentee.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentee.firstName + ' ' + mentee.lastName)}&background=random`}
                  className="h-full w-full object-cover"
                  alt={mentee.firstName + ' ' + mentee.lastName}
                  loading="lazy"
                />
              </div>
              <div className="h-2/5 flex flex-col gap-2 p-6">
                <h3 className="text-lg font-bold text-customDarkBlue">
                  {mentee.firstName} {mentee.lastName}
                </h3>
                <p className="flex items-center text-xs text-customDarkBlue font-normal">
                  <span>
                    <img
                      src="/image/tick.png"
                      className="object-cover h-4 w-4"
                      alt=""
                    />
                  </span>
                  {mentee.email}
                </p>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-1">
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Department: {mentee.department}
                    </p>
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Year: {mentee.yearOfStudy}
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
