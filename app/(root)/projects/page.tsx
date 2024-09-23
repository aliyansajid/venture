"use client";

import { useState, useEffect } from "react";
import AddProjectButton from "@/components/Projects/AddProjectButton";
import SectionHeader from "@/components/SectionHeader";
import TopHeader from "@/components/TopHeader";
import Loader from "@/components/Loader";
import ProjectCard from "@/components/Projects/ProjectCard";
import { fetchProjects } from "@/app/actions/projectActions";
import { Project } from "@/types/next-auth";
import { useToast } from "@/components/ui/use-toast";

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleFetchProjects = async (page = 1, limit = 10) => {
    try {
      const result = await fetchProjects(page, limit);

      if (!result.success) {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }

      setProjects(result.projects ?? []);
      setTotalPages(result.totalPages ?? 1);
    } catch (error) {
      toast({
        description: "Failed to fetch projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProjects(page, pageSize);
  }, [page, pageSize]);

  return (
    <section>
      <TopHeader />
      <SectionHeader title="Projects">
        <AddProjectButton />
      </SectionHeader>

      {isLoading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-144px)]">
          <h1 className="text-xl font-medium">No projects found.</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              dueDate={project.dueDate}
              totalTasks={project.totalTasks}
              completedTasks={project.completedTasks}
              client={project.client}
              teamMembers={project.team.teamMembers}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
