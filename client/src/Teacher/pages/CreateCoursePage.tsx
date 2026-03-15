import React, { useState } from 'react';
import TeacherSidebarDemo from '../components/TeacherSidebar';
import NewHeader from '../components/NewHeader';
import CreateCourseForm from '../components/CreateCourseForm';
import SessionManager from '@/utils/sessionManager';

const CreateCoursePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const sidebarWidth = sidebarOpen ? 250 : 60;

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="p-8 pt-32 bg-gray-100 min-h-screen">
          <CreateCourseForm />
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;