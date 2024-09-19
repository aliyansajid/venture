import React from "react";

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="text-gray-600">Team: {project.team.teamName}</p>
      <p className="text-gray-600">
        Team Lead: {project.team.teamLead.firstName}{" "}
        {project.team.teamLead.lastName}
      </p>
      <p className="text-gray-600">Priority: {project.priority}</p>
      <p className="text-gray-600">Budget: ${project.budget}</p>
      <p className="text-gray-600">Status: {project.status || "Not Started"}</p>
      <p className="text-gray-600">
        Due Date: {new Date(project.dueDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProjectCard;
