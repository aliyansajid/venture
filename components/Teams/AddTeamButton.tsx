"use client";

import React, { useState } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import ModalDialog from "@/components/ModalDialog";
import AddTeamForm from "@/components/forms/AddTeamForm";

const AddTeamButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CustomButton
        variant={ButtonVariant.DEFAULT}
        text="Add Team"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title="Add Team"
          description="Create a new team for your project."
          onClose={() => setIsModalOpen(false)}
        >
          <AddTeamForm />
        </ModalDialog>
      )}
    </>
  );
};

export default AddTeamButton;
