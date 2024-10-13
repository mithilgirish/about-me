export default function Projects() {
  const projects = [
    { 
      title: 'Crop-Core_Tech', 
      description: 'A crop yield prediction app using machine learning, with API integration and state rainfall data.' 
    },
    { 
      title: 'Pill-Dispenser', 
      description: 'A pill dispenser system controlled via a React app, integrated with ESP32 and servo motors.' 
    },
    { 
      title: 'Treximo', 
      description: 'A game built using Pygame, focusing on a unique interactive experience.' 
    },
    { 
      title: 'Music-Player', 
      description: 'A Python music player application built with a simple UI for playing local music files.' 
    },
    { 
      title: 'To-Do App', 
      description: 'A task management app built with React, featuring task sorting, due date management, and a clean UI.' 
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-amber-900">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <div key={index} className="bg-amber-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
