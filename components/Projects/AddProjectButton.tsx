"use client";

import React, { useState } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import ModalDialog from "@/components/ModalDialog";
import CreateProjectForm from "../forms/CreateProjectForm";

const AddProjectButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CustomButton
        variant={ButtonVariant.DEFAULT}
        text="Add Project"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title="Create New Project"
          description="Fill in the details to start your project."
          onClose={() => setIsModalOpen(false)}
        >
          <CreateProjectForm />
        </ModalDialog>
      )}
    </>
  );
};

export default AddProjectButton;
