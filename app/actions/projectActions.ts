"use server";

import { db } from "@/lib/prisma";

export async function fetchTeams() {
  try {
    const teams = await db.team.findMany({
      select: {
        id: true,
        teamName: true,
      },
    });

    return {
      success: true,
      teams,
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      success: false,
      message: "Failed to fetch teams.",
    };
  }
}

export async function createProject(data: any) {
  try {
    const team = await db.team.findUnique({
      where: { id: data.team },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const newProject = await db.project.create({
      data: {
        title: data.title,
        dueDate: new Date(data.dueDate),
        budget: data.budget,
        teamId: team.id,
        userId: team.teamLeadId,
        priority: data.priority,
      },
    });

    return {
      success: true,
      message: `Project ${newProject.title.toLowerCase()} created sucessfully.`,
      project: newProject,
    };
  } catch (error) {
    console.error("Failed to create project", error);
    return {
      success: false,
      message: "Failed to create the project.",
    };
  }
}

export async function fetchProjects(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  try {
    const projects = await db.project.findMany({
      skip,
      take: limit,
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
            teamLead: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalProjects = await db.project.count();

    return {
      success: true,
      projects,
      totalPages: Math.ceil(totalProjects / limit),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      message: "Failed to fetch projects.",
    };
  }
}

export async function fetchProjectById(projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
            teamLead: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return {
      success: false,
      message: "Failed to fetch project.",
    };
  }
}

export async function updateProject(projectId: string, data: any) {
  try {
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
      },
    });

    return {
      success: true,
      message: `Project ${updatedProject.title.toLowerCase()} updated successfully.`,
      project: updatedProject,
    };
  } catch (error) {
    console.error("Failed to update project", error);
    return {
      success: false,
      message: "Failed to update the project.",
    };
  }
}
