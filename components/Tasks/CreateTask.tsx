import { Task } from "@/types/next-auth";
import TaskForm from "../forms/TaskForm";

const CreateTask = ({
  projectId,
  onTaskCreated,
}: {
  projectId: string;
  onTaskCreated: (newTask: Task) => void;
}) => {
  return (
    <div>
      <div className="text-sm font-medium text-dark-secondary px-8 py-4 border-b border-border-primary">
        New Task Details
      </div>
      <div className="p-8">
        <TaskForm projectId={projectId} onTaskCreated={onTaskCreated} />
      </div>
    </div>
  );
};

export default CreateTask;
