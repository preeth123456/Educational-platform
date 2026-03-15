import React, { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, Award, Briefcase, Calendar, Mail, Phone, MapPin } from 'lucide-react';

interface Teacher {
  id: number;
  teacher_id: string;
  name: string;
  email: string;
  mobile: string;
  highest_qualification: string;
  experience_years: number;
  bio: string;
  boards: string[];
  subjects: string[];
  subject_classes: any;
  languages_known: string[];
  teaching_experience_institutes: any[];
  cv_file: string;
  achievements_file: string;
  experience_proof_file: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminTeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTeachers = async (status: string = 'pending') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/api/admin/teachers/?status=${status}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(activeTab);
  }, [activeTab]);

  const handleApprove = async (teacherId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/approve_teacher/${teacherId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Application approved' })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Teacher approved successfully!');
        fetchTeachers(activeTab);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error approving teacher:', error);
      alert('Error approving teacher');
    }
  };

  const handleReject = async (teacherId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/reject_teacher/${teacherId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Application rejected' })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Teacher rejected successfully!');
        fetchTeachers(activeTab);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error rejecting teacher:', error);
      alert('Error rejecting teacher');
    }
  };

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{teacher.name}</h3>
          <p className="text-sm text-gray-600">ID: {teacher.teacher_id}</p>
          <p className="text-sm text-blue-600">{teacher.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          teacher.status === 'Approved' ? 'bg-green-100 text-green-800' :
          teacher.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {teacher.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {teacher.mobile}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Award className="w-4 h-4 mr-2" />
          {teacher.highest_qualification}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          {teacher.experience_years} years exp.
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(teacher.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Subjects:</p>
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.map((subject, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Boards:</p>
        <div className="flex flex-wrap gap-1">
          {teacher.boards.map((board, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              {board}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setSelectedTeacher(teacher);
            setShowModal(true);
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>

        {teacher.status === 'Pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(teacher.id)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </button>
            <button
              onClick={() => handleReject(teacher.id)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const TeacherModal = () => {
    if (!selectedTeacher) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Teacher Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-800">{selectedTeacher.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Teacher ID</label>
                  <p className="text-gray-800">{selectedTeacher.teacher_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{selectedTeacher.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mobile</label>
                  <p className="text-gray-800">{selectedTeacher.mobile}</p>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Professional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Highest Qualification</label>
                  <p className="text-gray-800">{selectedTeacher.highest_qualification}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-gray-800">{selectedTeacher.experience_years} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Registration Date</label>
                  <p className="text-gray-800">{new Date(selectedTeacher.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedTeacher.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Bio</h3>
                <p className="text-gray-700">{selectedTeacher.bio}</p>
              </div>
            )}

            {/* Teaching Experience */}
            {selectedTeacher.teaching_experience_institutes && selectedTeacher.teaching_experience_institutes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Teaching Experience</h3>
                <div className="space-y-3">
                  {selectedTeacher.teaching_experience_institutes.map((institute: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">{institute.name}</h4>
                      <p className="text-sm text-gray-600">
                        {institute.fromYear} - {institute.toYear}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subjects and Boards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.subjects.map((subject, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Boards</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.boards.map((board, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {board}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            {selectedTeacher.languages_known && selectedTeacher.languages_known.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Languages Known</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.languages_known.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedTeacher.status === 'Pending' && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => handleApprove(selectedTeacher.id)}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Approve Teacher
                </button>
                <button
                  onClick={() => handleReject(selectedTeacher.id)}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-5 h-5 mr-2" />
                  Reject Teacher
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Management</h1>
          <p className="text-gray-600">Manage teacher registrations and approvals</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending Approval', count: teachers.length },
                { key: 'approved', label: 'Approved', count: 0 },
                { key: 'rejected', label: 'Rejected', count: 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                      {teachers.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-500">No teachers in {activeTab} status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && <TeacherModal />}
      </div>
    </div>
  );
};

export default AdminTeacherManagement;