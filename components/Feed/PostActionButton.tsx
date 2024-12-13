import React from "react";
import { Button } from "@/components/ui/button";

const PostActionButton = ({ icon: Icon, count, onClick, active = false }) => (
  <Button
    variant="ghost"
    size="sm"
    className={`flex items-center gap-2 hover:text-blue-500 ${
      active ? "text-blue-500" : ""
    }`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {count > 0 && <span className="text-sm">{count}</span>}
  </Button>
);

export default PostActionButton;
