import React from 'react';
import { Star, Award, BookOpen, Users } from 'lucide-react';

const Profile = () => {
  const handleImageError = (e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.currentTarget.alt)}&background=random`;
  };

  const mentors = [
    {
      name: "Emma Naku",
      image: "/mentors/emma.jpg",
      rating: 4.8,
      role: "Senior Software Engineer"
    },
    {
      name: "Asake Olamide",
      image: "/mentors/asake.jpg",
      rating: 4.7,
      role: "Product Manager"
    },
    {
      name: "Ruona Obi",
      image: "/mentors/ruona.jpg",
      rating: 4.9,
      role: "UX Designer"
    }
  ];

  const recommendations = [
    {
      name: "Chris David",
      rating: 4.8,
      comment: "Braide is a highly skilled mentor who helped me grow in my career journey. His guidance was invaluable.",
      role: "Software Developer"
    },
    {
      name: "Fola Henrich",
      rating: 4.9,
      comment: "Working with Braide has been transformative. His expertise and mentorship approach are exceptional.",
      role: "Product Designer"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="h-48 rounded-t-xl bg-gradient-to-r from-blue-400 to-blue-600 relative">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <img 
                src="/profile/braide.jpg" 
                alt="Braide Shekinah"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                onError={handleImageError}
              />
            </div>
          </div>

          <div className="pt-20 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Braide Shekinah</h1>
                <p className="text-gray-600 dark:text-gray-400">Head Product/System Coordinator</p>
              </div>
              <button className="text-orange-500 hover:text-orange-600 font-medium">
                Edit Profile
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                Braide is a very insightful mentor. He takes you from being confused to being in
                total clarity on what you need to do next and how to do it.
              </p>
            </div>

            <div className="mt-8 flex gap-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total learning time</p>
                  <p className="font-semibold">1,570 hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sessions completed</p>
                  <p className="font-semibold">25</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4">My Mentees</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentors.map((mentor, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={mentor.image} 
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full"
                        onError={handleImageError}
                      />
                      <div>
                        <h3 className="font-medium">{mentor.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.role}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm ml-1">{mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pb-8">
              <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{rec.rating}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{rec.comment}</p>
                    <div>
                      <p className="font-medium">{rec.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rec.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
