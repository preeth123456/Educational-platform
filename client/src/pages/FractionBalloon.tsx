import React from "react";
import FractionBalloonPop from "@/components/FractionBalloonPop";
import ProtectedRoute from "@/components/ProtectedRoute";

const FractionBalloonPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <FractionBalloonPop />
    </ProtectedRoute>
  );
};

export default FractionBalloonPage;


