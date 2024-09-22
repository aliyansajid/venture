import React from "react";
import ProjectForm from "../forms/CreateProjectForm";
import { ProjectFormProps } from "@/types/next-auth";

const GeneralInformation = ({ projectId, project }: ProjectFormProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">General Information</h2>
      <ProjectForm projectId={projectId} project={project} />
    </div>
  );
};

export default GeneralInformation;
