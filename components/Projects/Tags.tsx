import ProjectTags from "../forms/ProjectTags";

const Tags = ({ projectId }: { projectId?: string }) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Tags</h2>
      <ProjectTags projectId={projectId as string} />
    </div>
  );
};

export default Tags;
