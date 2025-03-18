import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLongArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "@/components/ui/calendar";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import axios from "axios";




function Overview() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchMentee = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://reqres.in/api/users");
        console.log(res.data);
        setMentees(res.data.data);
      } catch (error) {
        console.error("Error fetching mentees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, []);

  const { upDatePage, handleToggleState } = useContext(GlobalContext)
  const Title = [
    "#1 Tips for Success",
    "#2 Tips for Success",
    "#3 Tips for Success",
    "#4 Tips for Success",
  ];
  const Heading = [
    "How to prepare for your first meeting",
    "What should we talk   about during our meeting?",
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
    <section className=" p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between  ">
        <div className=" flex flex-col  w-full lg:flex-row justify-start  items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col  gap-4">
            <h1 className="text-[32px] font-medium">Welcome</h1>
            <p className="text-base font-meduim text-slate-600">You have no upcoming sessions</p>
          </div>


          <div className="flex justify-center gap-4">
            <img
              onClick={() => upDatePage("Message")}
              src="/image/messageIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt=""
            />
            <img
              onClick={() => upDatePage("Setting")}
              src="/image/settingIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt=""
            />
          </div>
        </div>


        <div onClick={handleToggleState} className=" block lg:hidden mt-3 ">
          <button>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="mt-11 flex flex-wrap lg:flex-nowrap gap-5 justify-center">
        {/* Profile Strength Section */}
        <div className="py-4 px-2 md:px-4 lg:px-5 rounded-lg bg-white shadow-2xl  w-[27%]">
          <div className="flex justify-between">
            <h1 className=" md:text-lg lg:text-2xl font-medium">Your profile strength</h1>

            <button className="h-[30px] w-[30px] flex justify-center items-center bg-slate-200 rounded-full">
              <FontAwesomeIcon icon={faLongArrowRight} />
            </button>
          </div>

          <p className="mt-3 text-gray-400 text-base lg:text-lg font-medium">
            Emmanuella Bernard
          </p>

          <div className="mt-3">
            <progress className="h-2 w-full" value="80" max="100"></progress>
          </div>

          <div className="mt-5 border-2 border-gray-100 w-full"></div>
          <div className="mt-5 flex justify-between">
            <h1 className=" text-base lg:text-lg text-gray-500 font-medium">
              Complete your 1st Mentorship Sessions Milestone
            </h1>

            <button className="h-[30px] w-[50px] flex justify-center items-center bg-slate-200 rounded-full">
              <FontAwesomeIcon icon={faLongArrowRight} />
            </button>
          </div>

          <div className="mt-3">
            <progress className="h-2 w-full" value="30" max="100"></progress>
          </div>
        </div>


        <div className="bg-white shadow-2xl  rounded-lg md:w-[40%] lg:w-[33%]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg w-full h-full -z-50"
          />
        </div>


        <div className="bg-white p-5 shadow-2xl rounded-lg md:w-[40%] lg:w-[33%] flex flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h1 className=" md:text-lg font-medium text-gray-600">{Title[index]}</h1>
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
            <p className=" text-sm md:text-lg text-gray-500 mt-2">{Message[index]}</p>
          </div>


        </div>
      </section>

      <section className=" mt-9">

        {/*  when the api is ready i will be getting the main data for just doing the demo design */}


        <div className=" flex justify-between">
          <h1 className="  text-base md:text-[22px] font-medium text-customDarkBlue">Your top matches </h1>
          <button onClick={() => upDatePage('Explore')} className=" p-2 md:p-0 h-10 rounded-xl md:w-40 text-white bg-customOrange  flex justify-center items-center">Explore Mentees</button>
        </div>
      </section>


      <section className="  rounded-lg   grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-y-5 gap-x-5  mt-12 ">
        {loading ? (
          <div>Loading...</div>
        ) : (
          mentees.map((mentee) => (
            <div
              onClick={() => upDatePage("Explore")}
              key={mentee.id}
              className="border-2 rounded-lg  overflow-hidden cursor-pointer w-[99%] h-[420px] bg-white"
            >
              <div className="h-3/5">
                <img
                  src={mentee.avatar} // Use the avatar from the API
                  className="h-full w-full object-cover"
                  alt={mentee.first_name}
                />
              </div>
              <div className="h-2/5 flex flex-col gap-2 p-6">
                <h3 className="text-lg font-bold text-customDarkBlue">
                  {mentee.first_name} {mentee.last_name}
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
                <p>4.0/5 (15 Testimonials)</p>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-1">
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Mentee
                    </p>
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Sessions: 21
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
      <div></div>
      <div></div>
    </section>


  );
}

export default Overview;
