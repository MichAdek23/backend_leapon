import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { GlobalContext } from '@/component/GlobalStore/GlobalState';

const Sessions = () => {
  const { handleToggleState } = useContext(GlobalContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions/mentee', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} session`);
      }

      // Refresh sessions after action
      fetchSessions();
    } catch (err) {
      console.error(`Error ${action}ing session:`, err);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'upcoming') {
      return new Date(session.date) > new Date();
    } else if (activeTab === 'past') {
      return new Date(session.date) < new Date();
    }
    return true;
  });

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="h-fit bg-gray-50 dark:bg-gray-900 pb-8">
      <header className="flex mt-4 justify-between px-4 mb-8">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-medium">My Sessions</h1>
            <p className="text-base font-medium text-slate-600">Manage your mentoring sessions</p>
          </div>
        </div>
        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button aria-label="Toggle menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'upcoming'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'past'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Past
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredSessions.map(session => (
            <div key={session._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={session.mentor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.mentor.name)}&background=random`}
                    alt={session.mentor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{session.mentor.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{session.topic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                {session.type === 'video' ? (
                  <button
                    onClick={() => window.open(session.meetingLink, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </button>
                ) : (
                  <button
                    onClick={() => window.open(session.meetingLink, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open Chat
                  </button>
                )}

                {activeTab === 'upcoming' && (
                  <>
                    <button
                      onClick={() => handleSessionAction(session._id, 'accept')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleSessionAction(session._id, 'reject')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sessions; 