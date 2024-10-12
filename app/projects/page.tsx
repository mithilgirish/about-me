export default function Projects() {
  const projects = [
    { title: 'Project 1', description: 'Description of project 1' },
    { title: 'Project 2', description: 'Description of project 2' },
    { title: 'Project 3', description: 'Description of project 3' },
    { title: 'Project 4', description: 'Description of project 4' },
  ]

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
  )
}