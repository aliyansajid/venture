import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckSquare, Calendar, Clock, Settings } from "lucide-react";

type Props = {
  title: string;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ title, activeTab, setActiveTab }: Props) => {
  return (
    <div className="border-b border-border-primary h-[69px] flex items-center gap-9 px-4 lg:px-8">
      <h1 className="text-2xl text-dark-primary font-medium">{title}</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 items-center"
      >
        <TabsList className="flex gap-4">
          <TabButton
            name="Tasks"
            icon={<CheckSquare size={20} />}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Calendar size={20} />}
            activeTab={activeTab}
          />
          <TabButton
            name="Activity"
            icon={<Clock size={20} />}
            activeTab={activeTab}
          />
          <TabButton
            name="Settings"
            icon={<Settings size={20} />}
            activeTab={activeTab}
          />
        </TabsList>
      </Tabs>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  activeTab: string;
};

const TabButton = ({ name, icon, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <TabsTrigger
      value={name}
      className={`h-[69px]  ${
        isActive ? "text-dark-primary" : "text-dark-secondary"
      }`}
    >
      {icon}
      <p className="text-sm font-medium">{name}</p>
    </TabsTrigger>
  );
};

export default ProjectHeader;
