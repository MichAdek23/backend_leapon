import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';
import { useAuth } from '../../../../lib/AuthContext';
import { format } from 'date-fns';
import { sessionApi } from '../../../../lib/api';

function Pending({ sessions }) {
  const { upDatePage } = useContext(GlobalContext);
  const { user } = useAuth();

  const handleJoinMeeting = (sessionId) => {
    // Implement meeting join logic
    console.log('Joining meeting for session:', sessionId);
  };

  const handleSendMessage = (recipientId) => {
    // Navigate to message component with recipient
    upDatePage('Message', { recipientId });
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await sessionApi.update(sessionId, { status: 'cancelled' });
      // The parent component will handle refreshing the sessions
    } catch (err) {
      console.error('Error canceling session:', err);
    }
  };

  if (!sessions || sessions.length === 0) {
    return <div className="text-center text-slate-500 py-6">No pending mentorship sessions.</div>;
  }

  return (
    <section>
      {sessions.map((session) => (
        <div key={session._id} className="py-6 border-b-2 border-slate-400">
          <div className="flex items-center gap-4">
            <img
              src={session.mentor._id === user.id ? session.mentee.profileImage : session.mentor.profileImage || '/default-avatar.png'}
              alt={`${session.mentor._id === user.id ? session.mentee.name : session.mentor.name}'s avatar`}
              className="h-24 w-24 rounded-full"
            />

            <div>
              <h1 className="text-slate-500">
                Mentorship Session with {session.mentor._id === user.id ? session.mentee.name : session.mentor.name}
              </h1>
              <p className="text-slate-400">
                {format(new Date(session.date), 'PPP p')}
              </p>
              <p className="text-slate-400">
                Duration: {session.duration} minutes
              </p>
              <p className="text-slate-400">
                Topic: {session.topic}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
            <button 
              onClick={() => handleJoinMeeting(session._id)}
              className="h-10 lg:h-12 min-w-[100px] md:min-w-[120px] p-2 rounded-lg text-slate-100 font-semibold bg-customOrange hover:bg-orange-600 transition-colors"
            >
              Join meeting
            </button>

            <button
              onClick={() => handleSendMessage(session.mentor._id === user.id ? session.mentee._id : session.mentor._id)}
              className="h-10 lg:h-12 min-w-[100px] md:min-w-[120px] p-2 rounded-lg border-2 font-semibold hover:bg-slate-100 transition-colors"
            >
              Send message
            </button>

            <button 
              onClick={() => handleCancelSession(session._id)}
              className="h-10 lg:h-12 min-w-[100px] md:min-w-[120px] p-2 rounded-lg border-2 font-semibold hover:bg-slate-100 transition-colors text-red-500 hover:bg-red-50"
            >
              Cancel Session
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Pending;