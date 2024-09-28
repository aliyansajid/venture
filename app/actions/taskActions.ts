"use server";
import { db } from "@/lib/prisma";

export async function createTask(values: any, projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    const assignee = await db.user.findUnique({
      where: { id: values.assignedTo },
    });

    if (!assignee) {
      return {
        success: false,
        message: "Assignee not found.",
      };
    }

    const newTask = await db.task.create({
      data: {
        title: values.title,
        description: values.description,
        dueDate: new Date(values.dueDate),
        priority: values.priority,
        status: values.status,
        projectId: project.id,
        assignedTo: assignee.id,
      },
    });

    await db.project.update({
      where: { id: project.id },
      data: {
        totalTasks: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: `Task '${newTask.title}' created successfully.`,
      task: newTask,
    };
  } catch (error) {
    console.error("Failed to create task", error);
    return {
      success: false,
      message: "Failed to create the task.",
    };
  }
}

export async function createSubtask(taskId: string, title: string) {
  try {
    const newSubtask = await db.subtask.create({
      data: {
        title,
        taskId,
      },
    });

    await db.task.update({
      where: { id: taskId },
      data: {
        totalSubTasks: {
          increment: 1,
        },
      },
    });

    return newSubtask;
  } catch (error) {
    console.error("Failed to create subtask", error);
    return null;
  }
}

export async function fetchSubtasks(taskId: string) {
  try {
    const subtasks = await db.subtask.findMany({
      where: { taskId },
    });

    return subtasks;
  } catch (error) {
    console.error("Failed to fetch subtasks", error);
    return [];
  }
}

export async function toggleSubtaskCompletion(
  subtaskId: string,
  completed: boolean
) {
  try {
    const subtask = await db.subtask.update({
      where: { id: subtaskId },
      data: {
        completed,
      },
    });

    await db.task.update({
      where: { id: subtask.taskId },
      data: {
        completedSubTasks: completed
          ? {
              increment: 1,
            }
          : {
              decrement: 1,
            },
      },
    });

    return subtask;
  } catch (error) {
    console.error("Failed to toggle subtask completion", error);
    return null;
  }
}

export async function deleteTask(taskId: string) {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return {
        success: false,
        message: "Task not found.",
      };
    }

    await db.task.delete({
      where: { id: taskId },
    });

    await db.project.update({
      where: { id: task.projectId },
      data: {
        totalTasks: {
          decrement: 1,
        },
      },
    });

    return {
      success: true,
      message: `Task '${task.title}' was successfully deleted.`,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      message: "An error occurred while trying to delete the task.",
    };
  }
}
