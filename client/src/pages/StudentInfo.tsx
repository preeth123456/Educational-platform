import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "./StudentInfo.css";
import "../Dashboard.css";
import StudentLayout from "../components/StudentLayout";
import { getAvatarUrl } from "../components/NewHeader";
import SessionManager, { StudentSession } from "../utils/sessionManager";
import SecurityIndicator from "../components/SecurityIndicator";
// Import FaHeart for the "like" icon
import { FaEdit, FaSave, FaTimes, FaUserCircle, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaHeart, FaAddressCard, FaCheckCircle } from "react-icons/fa";
import ComplianceSection from "../components/ComplianceSection";

// Interface remains the same
interface StudentProfile {
    id: number;
    student_id: string;
    name: string;
    gender: string;
    mobile_self: string;
    class: string;
    board: string;
    profile_picture: string;
    date_of_birth?: string;
    address?: string;
    parent_name?: string;
    parent_phone?: string;
    interests?: string;
}

const StudentInfo: React.FC = () => {
    // State definitions
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [, navigate] = useLocation();

    const interests = [
        'Mathematics', 'Science', 'English', 'History', 'Geography',
        'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Arts',
        'Music', 'Sports', 'Literature', 'Economics', 'Psychology'
    ];

    // Form state definition
    const [formData, setFormData] = useState<StudentProfile>({
        id: 0,
        student_id: '',
        name: '',
        gender: '',
        mobile_self: '',
        class: '',
        board: '',
        profile_picture: '',
        date_of_birth: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        interests: ''
    });

    // Initial data fetch logic
    useEffect(() => {
        const session = SessionManager.getSession();
        if (!session || session.role !== 'student') {
            navigate('/login');
            return;
        }
        const studentSession = session as StudentSession;
        setStudentSession(studentSession);

        setFormData(prev => ({
            ...prev,
            id: studentSession.id,
            student_id: studentSession.student_id,
            name: studentSession.name,
            mobile_self: studentSession.phone,
            class: studentSession.class,
            board: studentSession.board,
        }));

        fetchStudentData(studentSession.student_id);
        loadUserTheme(studentSession.id);
    }, [navigate]);

    const loadUserTheme = async (studentId: number) => {
        try {
            const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                const root = document.documentElement;
                if (data.data.theme === 'dark') {
                    root.classList.add('dark-theme');
                } else if (data.data.theme === 'light') {
                    root.classList.remove('dark-theme');
                }
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const fetchStudentData = async (studentId: string) => {
        try {
            // *** CORRECTED PORT TO 8001 ***
            const response = await fetch(`http://localhost:8001/api/auth/get_student/?student_id=${studentId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    setFormData(prev => ({
                        ...prev,
                        ...data.data,
                    }));

                    if (data.data.interests) {
                        try {
                            const parsedInterests = JSON.parse(data.data.interests);
                            setSelectedInterests(Array.isArray(parsedInterests) ? parsedInterests : []);
                        } catch {
                            setSelectedInterests([]);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev => {
            const newInterests = prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest];

            setFormData(prevForm => ({
                ...prevForm,
                interests: JSON.stringify(newInterests)
            }));
            return newInterests;
        });
    };

    const handleSave = async () => {
        const confirmed = window.confirm("Are you sure you want to save these changes?");
        if (!confirmed) {
            fetchStudentData(formData.student_id);
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            console.log('Sending update data:', formData);
            // *** CORRECTED PORT TO 8001 ***
            const response = await fetch('http://localhost:8001/api/auth/update_student/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('Update response:', result);

            if (response.ok && result.status === 'success') {
                setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
                setIsEditing(false);

                const updatedSession = {
                    id: result.data.id,
                    student_id: result.data.student_id,
                    name: result.data.name,
                    phone: result.data.mobile_self,
                    class: result.data.class,
                    board: result.data.board,
                    gender: result.data.gender,
                    profile_picture: result.data.profile_picture
                };
                SessionManager.saveSession(updatedSession);
                fetchStudentData(formData.student_id);

            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update profile ❌' });
            }
        } catch (error) {
            console.error('Network error on save:', error);
            setMessage({ type: 'error', text: 'Network connection failed. Please check your server connection (localhost:8001) and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setMessage(null);
        fetchStudentData(formData.student_id);
    };

    return (
        <StudentLayout>
            <div className="student-info-page">
                {/* Message Display (Toast) */}
                {message && (
                    <div className={`notification-message ${message.type}`}>
                        {message.text}
                        <button onClick={() => setMessage(null)} className="close-btn">×</button>
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="profile-card-container">
                    <div className="profile-header-visual">
                         <div className="avatar-group">
                            <img
                                src={formData.profile_picture || getAvatarUrl(formData.gender)}
                                alt={formData.name}
                                className="profile-image-large"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getAvatarUrl(formData.gender);
                                }}
                            />
                            {isEditing && (
                                <button className="image-edit-overlay" onClick={() => alert("Image Upload feature not yet implemented!")}>
                                    <FaEdit />
                                </button>
                            )}
                        </div>
                        <div className="profile-text">
                            <h1 className="profile-name">{formData.name}</h1>
                            <p className="profile-id-tag">Student ID: **{formData.student_id}**</p>
                            <SecurityIndicator userId={formData.id} userType="student" showDetails={true} />
                        </div>

                        {/* Edit/Save/Cancel Buttons */}
                        <div className="profile-action-buttons">
                            {isEditing ? (
                                <>
                                    <button
                                        className="action-btn save-btn"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        <FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        className="action-btn cancel-btn"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <FaEdit /> Update Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Information Layout - Two-column grid */}
                <div className="info-main-grid">

                    {/* Left Column: Personal & Academic Information */}
                    <div className="info-column">
                        <div className="info-card">
                            <h2 className="info-card-header"><FaUserCircle className="header-icon"/> Personal Details</h2>
                            <div className="info-data-grid">
                                <InfoField label="Student Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} type="text" icon={<FaUserCircle />} />
                                <InfoField label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleInputChange} type="select" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} icon={<FaUserCircle />} />
                                <InfoField label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} isEditing={isEditing} onChange={handleInputChange} type="date" placeholder="Not provided" icon={<FaCalendarAlt />} />
                                <InfoField label="Student ID" name="student_id" value={formData.student_id} isEditing={false} type="text" readOnly={true} icon={<FaAddressCard />} />
                            </div>
                        </div>

                        <div className="info-card">
                            <h2 className="info-card-header"><FaGraduationCap className="header-icon"/> Academic Details</h2>
                            <div className="info-data-grid">
                                <InfoField label="Current Class" name="class" value={formData.class} isEditing={isEditing} onChange={handleInputChange} type="select" options={Array.from({length: 12}, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))} icon={<FaGraduationCap />} />
                                <InfoField label="Board/Curriculum" name="board" value={formData.board} isEditing={isEditing} onChange={handleInputChange} type="select" options={[{ value: "cbse", label: "CBSE" }, { value: "icse", label: "ICSE" }, { value: "state", label: "State Board" }, { value: "ib", label: "International Baccalaureate" }, { value: "igcse", label: "IGCSE" }]} icon={<FaGraduationCap />} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Interests Information */}
                    <div className="info-column">

                        <div className="info-card">
                            <h2 className="info-card-header"><FaPhone className="header-icon"/> Contact Information</h2>
                            <div className="info-data-grid">
                                <InfoField label="Mobile (Self)" name="mobile_self" value={formData.mobile_self} isEditing={isEditing} onChange={handleInputChange} type="tel" icon={<FaPhone />} />
                                <InfoField label="Parent/Guardian Name" name="parent_name" value={formData.parent_name} isEditing={isEditing} onChange={handleInputChange} type="text" placeholder="Not provided" icon={<FaUserCircle />} />
                                <InfoField label="Parent/Guardian Phone" name="parent_phone" value={formData.parent_phone} isEditing={isEditing} onChange={handleInputChange} type="tel" placeholder="Not provided" icon={<FaPhone />} />
                                <InfoField label="Email (Student ID)" name="student_id_email" value={formData.student_id ? `${formData.student_id}@student.edu` : ''} isEditing={false} type="text" readOnly={true} icon={<FaEnvelope />} />
                                <InfoField label="Residential Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleInputChange} type="textarea" placeholder="Not provided" icon={<FaMapMarkerAlt />} fullWidth={true} />
                            </div>
                        </div>

                        <div className="info-card">
                            <h2 className="info-card-header"><FaHeart className="header-icon"/> Interests & Hobbies</h2>
                            <div className="interests-selection-area">
                                {isEditing ? (
                                    <div className="interests-grid-edit">
                                        {interests.map(interest => (
                                            <button
                                                key={interest}
                                                type="button"
                                                className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                                                onClick={() => handleInterestToggle(interest)}
                                            >
                                                {interest} {selectedInterests.includes(interest) && <FaHeart className="heart-icon" />}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="interests-display">
                                        {selectedInterests.length > 0 ? (
                                            selectedInterests.map(interest => (
                                                <span key={interest} className="interest-tag-display">
                                                    {interest} <FaHeart className="heart-icon" />
                                                </span>
                                            ))
                                        ) : (
                                            <p className="not-provided">No interests selected. Click 'Update Profile' to add some!</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <ComplianceSection userId={formData.id} userType="student" />
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentInfo;

// --- Helper Component for DRY Information Fields ---
interface InfoFieldProps {
    label: string;
    name: string;
    value: string | undefined;
    isEditing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    type: 'text' | 'tel' | 'date' | 'select' | 'textarea';
    options?: { value: string; label: string }[];
    readOnly?: boolean;
    placeholder?: string;
    icon: React.ReactNode;
    fullWidth?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, name, value, isEditing, onChange, type, options, readOnly = false, placeholder = 'Not provided', icon, fullWidth = false }) => {
    const displayValue = value || placeholder;

    return (
        <div className={`info-field-item ${fullWidth ? 'full-width' : ''}`}>
            <label className="info-label">{icon} {label}</label>
            {isEditing && !readOnly ? (
                type === 'select' ? (
                    <select
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        className="info-input"
                    >
                        <option value="">{`Select ${label}`}</option>
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                ) : type === 'textarea' ? (
                       <textarea
                        name={name}
                        value={value || ''}
                        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                        rows={3}
                        className="info-input textarea"
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value || ''}
                        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                        className="info-input"
                        readOnly={readOnly}
                        placeholder={placeholder}
                    />
                )
            ) : (
                <p className={`info-value ${!value ? 'placeholder-value' : ''} ${readOnly ? 'readonly-value' : ''}`}>
                    {displayValue}
                </p>
            )}
        </div>
    );
};


