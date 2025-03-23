import React from 'react';
import { useAuth } from '../../../../lib/AuthContext';
import { format } from 'date-fns';

function History({ sessions }) {
  const { user } = useAuth();

  if (!sessions || sessions.length === 0) {
    return <div className="text-center text-slate-500 py-6">No completed sessions found.</div>;
  }

  return (
    <section className="space-y-6">
      {sessions.map((session) => (
        <div key={session._id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={session.mentor._id === user.id ? session.mentee.profileImage : session.mentor.profileImage || '/default-avatar.png'}
              alt={`${session.mentor._id === user.id ? session.mentee.name : session.mentor.name}'s avatar`}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-medium text-slate-700">
                Session with {session.mentor._id === user.id ? session.mentee.name : session.mentor.name}
              </h2>
              <p className="text-sm text-slate-500">
                {format(new Date(session.date), 'PPP p')}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Duration:</span> {session.duration} minutes
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Topic:</span> {session.topic}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Type:</span> {session.type}
              </p>
            </div>
            {session.feedback && (
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-sm font-medium text-slate-700">Feedback</p>
                {session.feedback.rating && (
                  <p className="text-sm text-slate-600">
                    Rating: {'⭐'.repeat(session.feedback.rating)}
                  </p>
                )}
                {session.feedback.comment && (
                  <p className="text-sm text-slate-600 mt-1">
                    "{session.feedback.comment}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default History;