import { useState } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import TaskForm from "../forms/TaskForm";
import ModalDialog from "../ModalDialog";

const CreateTaskModal = ({ projectId }: { projectId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <CustomButton
        variant={ButtonVariant.LINK}
        text="Create new task"
        iconSrc="/icons/PlusCircle.svg"
        iconAlt="Plus Circle"
        onClick={() => setIsModalOpen(true)}
        className="h-auto p-0"
      />

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title="Create New Task"
          description="Fill in the details to create new task."
          onClose={() => setIsModalOpen(false)}
        >
          <TaskForm projectId={projectId} />
        </ModalDialog>
      )}
    </>
  );
};

export default CreateTaskModal;
