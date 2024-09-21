"use client";

import TopHeader from "@/components/TopHeader";
import { ProjectDetailProps } from "@/types/next-auth";
import React, { useEffect, useState } from "react";
import ProjectHeader from "@/components/Projects/Header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Settings from "@/components/Projects/Settings";
import Loader from "@/components/Loader";
import { fetchProjectById } from "@/app/actions/projectActions";

const ProjectDetail = ({ params: { id } }: ProjectDetailProps) => {
  const [project, setProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Tasks");

  useEffect(() => {
    const fetchProjectData = async () => {
      const result = await fetchProjectById(id);

      if (result.success) {
        setProject(result.project);
      } else {
        console.error(result.message);
      }

      setIsLoading(false);
    };

    fetchProjectData();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <TopHeader />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ProjectHeader
          title={project?.title}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <TabsContent value="Tasks">
          <div>Task content goes here</div>
        </TabsContent>
        <TabsContent value="Timeline">
          <div>Timeline content goes here</div>
        </TabsContent>
        <TabsContent value="Activity">
          <div>Activity content goes here</div>
        </TabsContent>
        <TabsContent value="Settings">
          <Settings projectId={id} project={project} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProjectDetail;
