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
