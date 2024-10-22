import React from "react";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center">
      <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
    </div>
  );
};

export default Loading;
