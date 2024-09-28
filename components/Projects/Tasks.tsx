import { useState } from "react";
import { Task, Subtask } from "@/types/next-auth";
import TaskDetail from "../Tasks/TaskDetail";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import CreateTaskModal from "../Tasks/CreateTask";
import { Separator } from "@/components/ui/separator";

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

  const handleTaskClick = (task: Task) => {
    if (selectedTask && selectedTask.id === task.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
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
      <div className={`w-${selectedTask ? "1/2" : "full"} p-8`}>
        <div className="border border-border-primary rounded-md">
          <div className="flex p-4">
            <CreateTaskModal projectId={projectId} />
          </div>

          <Separator orientation="horizontal" className="h-[0.5px]" />

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

      {selectedTask && (
        <div className="w-1/2 border-l border-border-primary">
          <TaskDetail
            projectId={projectId}
            task={selectedTask}
            updateChecklist={(updatedChecklist, taskCompleted) =>
              updateChecklist(selectedTask.id, updatedChecklist, taskCompleted)
            }
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;
