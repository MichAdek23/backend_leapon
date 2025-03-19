import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';

function Pending() {
  const { acceptedMentees, upDatePage } = useContext(GlobalContext);
  console.log('acceptedMentees:', acceptedMentees); // Debugging log

  // Handle undefined or empty acceptedMentees
  if (!acceptedMentees || acceptedMentees.length === 0) {
    return <div className="text-center text-slate-500 py-6">No pending mentorship sessions.</div>;
  }

  return (
    <section>
      {acceptedMentees.map((pending) => (
        <div key={pending.id} className="py-6 border-b-2 border-slate-400">
          <div className="flex items-center gap-4">
            {/* Mentee Avatar */}
            <img
              src={pending.avatar || '/default-avatar.png'} // Fallback for missing avatar
              alt={`${pending.first_name}'s avatar`} // Accessible alt text
              className="h-24 w-24 rounded-full"
            />

            {/* Mentee Details */}
            <div>
              <h1 className="text-slate-500">
                Mentorship Session with {pending.first_name || 'Unknown'} {/* Fallback for missing name */}
              </h1>
              <p className="text-slate-400">Wed, 31 July 2025</p> {/* Replace with dynamic date if needed */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 mt-8">
            <button className="h-12 w-32 p-2 rounded-lg text-slate-100 font-semibold bg-customOrange hover:bg-orange-600 transition-colors">
              Join meeting
            </button>
            <button
              onClick={() => upDatePage('Message')}
              className="h-12 w-32 p-2 rounded-lg border-2 font-semibold hover:bg-slate-100 transition-colors"
            >
              Send message
            </button>
            <button className="h-12 w-32 p-2 rounded-lg border-2 font-semibold hover:bg-slate-100 transition-colors">
              Cancel Session
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Pending;