import { useState } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import TaskForm from "../forms/TaskForm";
import ModalDialog from "../ModalDialog";

const Tasks = ({ projectId }: { projectId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-8">
      <CustomButton
        variant={ButtonVariant.GHOST}
        text="Create new task"
        onClick={() => setIsModalOpen(true)}
        className="p-0 hover:bg-white hover:underline"
      />

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title="Create New Project"
          description="Fill in the details to start your project."
          onClose={() => setIsModalOpen(false)}
        >
          <TaskForm projectId={projectId} />
        </ModalDialog>
      )}
    </div>
  );
};

export default Tasks;
