import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-144px)]">
      <Loader2 size={40} className="spin-animation" />
    </div>
  );
};

export default Loader;
