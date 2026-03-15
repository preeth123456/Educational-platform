import React from 'react';
import StudentLayout from '../components/StudentLayout';
import StudentVirtualClassrooms from '../components/StudentVirtualClassrooms';

const VirtualClassroomsPage: React.FC = () => {
  return (
    <StudentLayout>
      <div style={{ padding: '20px', paddingTop: '100px' }}>
        <StudentVirtualClassrooms />
      </div>
    </StudentLayout>
  );
};

export default VirtualClassroomsPage;