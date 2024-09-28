"use client";

import TopHeader from "@/components/TopHeader";
import { Project } from "@/types/next-auth";
import React, { useEffect, useState } from "react";
import ProjectHeader from "@/components/Projects/Header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Settings from "@/components/Projects/Settings";
import Loader from "@/components/Loader";
import { fetchProject } from "@/app/actions/projectActions";
import { useToast } from "@/components/ui/use-toast";
import Tasks from "@/components/Projects/Tasks";

const ProjectDetail = ({ params: { id } }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [project, setProject] = useState<Project>();
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Tasks");

  useEffect(() => {
    const handleFetchProject = async () => {
      const result = await fetchProject(id);

      if (result.success) {
        setProject(result.project);
      } else {
        setProjectNotFound(true);
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    handleFetchProject();
  }, [id]);

  return (
    <section>
      <TopHeader />
      {isLoading ? (
        <Loader />
      ) : projectNotFound ? (
        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <h1 className="text-xl font-medium">
            The requested project could not be found.
          </h1>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ProjectHeader
              title={project?.title as string}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <TabsContent value="Tasks">
              {project && <Tasks projectId={id} project={project} />}
            </TabsContent>
            <TabsContent value="Timeline">
              <div>Timeline content goes here</div>
            </TabsContent>
            <TabsContent value="Activity">
              <div>Activity content goes here</div>
            </TabsContent>
            <TabsContent value="Settings">
              {project && <Settings projectId={id} project={project} />}
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
};

export default ProjectDetail;
