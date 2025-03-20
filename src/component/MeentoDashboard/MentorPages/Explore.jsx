import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import axios from "axios";

function Explore() {
  const { upDatePage, handleToggleState, setSelectedMentee, AddMentees, acceptedMentees } =
    useContext(GlobalContext);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [applySearch, setApplySearch] = useState(false);

  useEffect(() => {
    const fetchMentee = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://reqres.in/api/users");
        localStorage.setItem('mentee', JSON.stringify(res.data.data));
        setMentees(res.data.data);
      } catch (error) {
        console.error("Error fetching mentees:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, []);

  // Filter mentees based on search input and acceptedMentees
  const filteredData = mentees
    .filter((item) => !acceptedMentees.some((mentee) => mentee.id === item.id))
    .filter((item) =>
      applySearch
        ? inputSearch
          ? item.first_name.toLowerCase().includes(inputSearch.toLowerCase()) ||
            item.last_name.toLowerCase().includes(inputSearch.toLowerCase()) ||
            item.email.toLowerCase().includes(inputSearch.toLowerCase())
          : true
        : true
    );

  const handleSearch = () => {
    setApplySearch(true);
  };

  const handleBookingNavigation = (mentee) => {
    localStorage.setItem('mentee', JSON.stringify(mentee));
    setSelectedMentee(mentee);
    AddMentees(mentee);
    upDatePage('Booking');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!mentees || mentees.length === 0) {
    return <div className="text-4xl flex justify-center items-center h-96">No mentees available</div>;
  }

  return (
    <section className="p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Mentees</h1>
            <p className="text-base font-medium text-slate-600">Accept Mentee</p>
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
              placeholder="Search by name, role, specific area of mentorship"
              className="w-full outline-none h-full bg-transparent"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              aria-label="Search by name, role, specific area of mentorship"
            />
          </div>
          <div onClick={handleSearch} className="h-full cursor-pointer flex justify-center items-center rounded-2xl bg-customOrange py-6 md:py-2 md:w-[12%]">
            <button className="text-base font-bold text-white">Find Mentor</button>
          </div>
        </section>
      </div>

      {/* Mentee Cards */}
      <section className="h-fit cursor-pointer mt-24 md:mt-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-4">
        {filteredData.map((mentee) => (
          <div
            key={mentee.id}
            className="border-2 rounded-lg w-full h-[400px] lg:w-fit md:h-fit bg-white"
          >
            <div className="h-1/2 w-full md:h-3/5">
              <img
                src={mentee.avatar}
                className="h-full w-full object-cover"
                alt={mentee.first_name}
                loading="lazy"
              />
            </div>
            <div className="h-1/2 md:h-2/5 p-6">
              <h3 className="text-lg font-bold text-customDarkBlue">
                {mentee.first_name} {mentee.last_name}
              </h3>
              <p className="flex items-center text-xs text-customDarkBlue font-normal">
                <span>
                  <img
                    src="/image/tick.png"
                    className="object-cover h-4 w-4"
                    alt="Verified"
                  />
                </span>
                {mentee.email}
              </p>
              <p>4.0/5 (15 Testimonials)</p>

              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-1">
                  <p className="text-xs p-2 rounded-lg bg-slate-200">
                    Experience: 3 Years
                  </p>
                  <p className="text-xs p-2 rounded-lg bg-slate-200">
                    Sessions: 21
                  </p>
                </div>
                <div onClick={() => handleBookingNavigation(mentee)} className="px-8 bg-customOrange py-3 cursor-pointer rounded-xl text-base font-medium text-white">
                  <button>Accept Mentee</button>
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