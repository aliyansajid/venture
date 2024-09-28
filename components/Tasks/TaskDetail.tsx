import { useState, useEffect } from "react";
import { Task, Subtask } from "@/types/next-auth";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchSubtasks,
  createSubtask,
  toggleSubtaskCompletion,
  deleteTask,
} from "@/app/actions/taskActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { taskActions } from "@/data";
import CustomButton, { ButtonVariant } from "../CustomButton";
import React from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import ModalDialog from "../ModalDialog";

const TaskDetail = ({
  task,
  updateChecklist,
}: {
  task: Task;
  updateChecklist: (checklist: Subtask[]) => void;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);
  const [checklist, setChecklist] = useState<Subtask[]>([]);
  const totalSubtasks = checklist.length;
  const completedSubtasks = checklist.filter((item) => item.completed).length;
  const progress = (completedSubtasks / totalSubtasks) * 100 || 0;

  useEffect(() => {
    const loadSubtasks = async () => {
      const subtasks = await fetchSubtasks(task.id);
      if (subtasks) {
        setChecklist(
          subtasks.filter((subtask): subtask is Subtask => subtask !== null)
        );
        updateChecklist(subtasks);
      }
    };
    loadSubtasks();
  }, [task.id, updateChecklist]);

  const handleAddChecklistItem = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      const inputValue = e.currentTarget.value;
      e.currentTarget.value = "";

      const newSubtask = await createSubtask(task.id, inputValue);
      if (newSubtask) {
        const updatedChecklist = [...checklist, newSubtask];
        setChecklist(updatedChecklist);
        updateChecklist(updatedChecklist);
      }
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    const updatedSubtask = await toggleSubtaskCompletion(
      subtask.id,
      !subtask.completed
    );
    if (updatedSubtask) {
      const updatedChecklist = checklist.map((item) =>
        item.id === subtask.id ? updatedSubtask : item
      );
      setChecklist(updatedChecklist);
      updateChecklist(updatedChecklist);
    }
  };

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      const result = await deleteTask(task.id);

      if (!result.success) {
        toast({
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setIsModalOpen(false);
      router.push("/projects");
    } catch (error) {
      toast({
        description: "Error deleting the note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuItem = async (menuItem: any) => {
    try {
      if (menuItem.action === "deleteTask") {
        setModalContent({
          title: menuItem.modalTitle,
          description: menuItem.modalDescription,
        });
        setModalChildren(
          <div className="flex justify-end gap-2">
            <CustomButton
              variant={ButtonVariant.DEFAULT}
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
            />
            <CustomButton
              variant={ButtonVariant.DESTRUCTIVE}
              text="Delete"
              onClick={async () => {
                await handleDeleteTask();
              }}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        );
        setIsModalOpen(true);
      } else if (menuItem.component) {
        setModalContent({
          title: menuItem.modalTitle,
          description: menuItem.modalDescription,
        });
        setModalChildren(
          React.createElement(menuItem.component, { taskId: task.id })
        );
        setIsModalOpen(true);
      }
    } catch (error) {
      toast({
        description: `Error processing ${menuItem.action}:`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between px-8 py-4 border-b border-border-primary">
        <span className="text-sm font-medium text-dark-secondary">
          Task Overview
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src="/icons/More.svg"
              alt="More"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {taskActions.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={() => handleMenuItem(item)}
                className={
                  item.action === "deleteTask"
                    ? "text-red-base focus:text-red-base"
                    : ""
                }
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between items-center bg-background-secondary px-8 py-4">
        {totalSubtasks > 0 ? (
          <>
            <span className="text-sm text-dark-secondary">
              Overall progress {completedSubtasks}/{totalSubtasks} subtasks
              complete
            </span>
            <div className="relative w-3/12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-base rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <span className="text-sm text-dark-secondary">
            Create subtasks to track progress
          </span>
        )}
      </div>

      <div className="p-8 space-y-6">
        <h3 className="text-xl font-medium">{task.title}</h3>
        <div className="flex justify-between">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Assigned To</h4>
            <div className="flex items-center gap-2">
              <Image
                src={task.assignee.image || "/icons/UserCircle.svg"}
                alt="User"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{`${task.assignee.firstName} ${task.assignee.lastName}`}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Due Date</h4>
            <Badge variant={"outline"}>
              <Calendar size={16} />
              {task.dueDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-medium">Description</h4>
          <p className="text-sm text-dark-secondary">{task.description}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-medium">Checklist</h4>
          <ul className="space-y-2 m-0 p-0">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleSubtask(item)}
                />
                <span
                  className={`text-sm ${item.completed ? "line-through" : ""}`}
                >
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Checkbox disabled />
            <Input
              type="text"
              placeholder="Type to add more..."
              className="h-auto text-dark-primary p-0 border-none rounded-none"
              onKeyDown={handleAddChecklistItem}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title={modalContent.title}
          description={modalContent.description}
          onClose={() => setIsModalOpen(false)}
        >
          {modalChildren}
        </ModalDialog>
      )}
    </div>
  );
};

export default TaskDetail;
