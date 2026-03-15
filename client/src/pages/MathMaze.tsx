import React from "react";
import MathMazeAdventure from "@/components/MathMazeAdventure";
import ProtectedRoute from "@/components/ProtectedRoute";

const MathMazePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <MathMazeAdventure />
    </ProtectedRoute>
  );
};

export default MathMazePage;


