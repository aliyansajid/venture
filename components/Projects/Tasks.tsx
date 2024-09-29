import { useState } from "react";
import { Task, Subtask } from "@/types/next-auth";
import TaskDetail from "../Tasks/TaskDetail";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import CustomButton, { ButtonVariant } from "../CustomButton";
import CreateTask from "../Tasks/CreateTask";

const Tasks = ({
  projectId,
  tasks: initialTasks,
  onUpdateProjectTasks,
}: {
  projectId: string;
  tasks: Task[];
  onUpdateProjectTasks: (completedTasksDelta: number) => void;
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleCreateTask = () => {
    setIsCreatingTask(true);
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setIsCreatingTask(false);
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsCreatingTask(false); // Close the create task form after creation
    setSelectedTask(newTask); // Optionally select the newly created task
  };

  const updateChecklist = (
    taskId: string,
    updatedChecklist: Subtask[],
    taskCompleted: boolean
  ) => {
    const taskWasCompleted = tasks
      .find((task) => task.id === taskId)
      ?.subtasks.every((subtask) => subtask.completed);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, subtasks: updatedChecklist } : task
      )
    );

    if (taskCompleted && !taskWasCompleted) {
      onUpdateProjectTasks(1);
    } else if (!taskCompleted && taskWasCompleted) {
      onUpdateProjectTasks(-1);
    }
  };

  return (
    <div className="flex">
      <div
        className={`w-${selectedTask || isCreatingTask ? "1/2" : "full"} p-8`}
      >
        <div className="border border-border-primary rounded-md">
          <div className="flex p-4">
            <CustomButton
              variant={ButtonVariant.LINK}
              text="Create new task"
              iconSrc="/icons/PlusCircle.svg"
              iconAlt="Plus Circle"
              className="h-auto p-0"
              onClick={handleCreateTask}
            />
          </div>

          {tasks.length > 0 && (
            <Separator orientation="horizontal" className="h-[0.5px]" />
          )}

          <ul className="list-none p-0 m-0">
            {tasks.map((task, index) => {
              const subtasks = task.subtasks || [];
              const completedSubtasks = subtasks.filter(
                (subtask: Subtask) => subtask.completed
              ).length;
              const totalSubtasks = subtasks.length;

              return (
                <li
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`cursor-pointer ${
                    index !== tasks.length - 1
                      ? "border-b border-border-primary"
                      : ""
                  } p-4`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                      <Checkbox
                        checked={
                          completedSubtasks === totalSubtasks &&
                          totalSubtasks > 0
                        }
                        disabled={totalSubtasks === 0}
                      />
                      <h2 className="text-base font-medium">{task.title}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark-secondary">
                      <div className="flex items-center gap-1">
                        <Image
                          src="/icons/Checklist.svg"
                          alt="Checklist"
                          width={20}
                          height={20}
                        />
                        <span>{`${completedSubtasks}/${totalSubtasks}`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image
                          src="/icons/ChatCircle.svg"
                          alt="Chat Circle"
                          width={20}
                          height={20}
                        />
                        <span>8</span>
                      </div>
                    </div>
                    <Image
                      src={task.assignee.image || "/icons/UserCircle.svg"}
                      alt={task.assignee.firstName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {(selectedTask || isCreatingTask) && (
        <div className="w-1/2 border-l border-border-primary">
          {selectedTask && (
            <TaskDetail
              projectId={projectId}
              task={selectedTask}
              updateChecklist={(updatedChecklist, taskCompleted) =>
                updateChecklist(
                  selectedTask.id,
                  updatedChecklist,
                  taskCompleted
                )
              }
            />
          )}
          {isCreatingTask && (
            <CreateTask
              projectId={projectId}
              onTaskCreated={handleTaskCreated}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
