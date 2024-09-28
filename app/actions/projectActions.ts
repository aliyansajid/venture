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

export async function fetchClients() {
  try {
    const clients = await db.user.findMany({
      where: { role: "Client" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
      },
    });

    return {
      success: true,
      clients,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return {
      success: false,
      message: "Failed to fetch clients.",
    };
  }
}

export async function createProject(data: any) {
  try {
    const team = await db.team.findUnique({
      where: { id: data.team },
    });

    if (!team) {
      return {
        success: false,
        message: "Team not found.",
      };
    }

    const newProject = await db.project.create({
      data: {
        title: data.title,
        dueDate: new Date(data.dueDate),
        budget: data.budget,
        teamId: team.id,
        userId: team.teamLeadId,
        priority: data.priority,
        clientId: data.client || null,
      },
    });

    return {
      success: true,
      message: `Project ${newProject.title.toLowerCase()} created successfully.`,
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

export async function fetchProject(projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            priority: true,
            status: true,
            subtasks: true,
            assignee: {
              select: {
                firstName: true,
                lastName: true,
                image: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error fetching project: ", error);
    return {
      success: false,
      message: "Failed to fetch project.",
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
            membersIds: true,
          },
        },
        client: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    const teamMembersData = await Promise.all(
      projects.map(async (project) => {
        const teamMembers = await db.user.findMany({
          where: {
            id: {
              in: project.team.membersIds,
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            image: true,
          },
        });
        return {
          projectId: project.id,
          teamMembers,
        };
      })
    );

    const projectsWithTeamMembers = projects.map((project) => {
      const membersData = teamMembersData.find(
        (members) => members.projectId === project.id
      );

      return {
        ...project,
        team: {
          ...project.team,
          teamMembers: membersData?.teamMembers || [],
        },
      };
    });

    const totalProjects = await db.project.count();

    return {
      success: true,
      projects: projectsWithTeamMembers,
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
    console.error("Failed to update project: ", error);
    return {
      success: false,
      message: "Failed to update the project.",
    };
  }
}

export async function updateProjectTags(id: string, newTags: string[]) {
  try {
    const updatedProject = await db.project.update({
      where: { id },
      data: { tags: newTags },
    });

    return {
      success: true,
      message: "Tags updated successfully.",
      project: updatedProject,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error updating tags: ", error);

    return {
      success: false,
      message: "Error updating tags.",
      status: 500,
    };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await db.project.delete({
      where: { id: projectId },
    });

    return {
      success: true,
      message: "Project deleted successfully.",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error deleting project: ", error);
    return {
      success: false,
      message: "Failed to delete the project.",
      status: 500,
    };
  }
}
