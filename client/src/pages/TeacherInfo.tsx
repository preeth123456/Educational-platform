import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "./StudentInfo.css";
import "../Dashboard.css";
import { getAvatarUrl } from "../components/NewHeader";
import SessionManager, { TeacherSession } from "../utils/sessionManager";
import { TeacherSidebarDemo } from "../Teacher/components/TeacherSidebar";
import NewHeader from "../Teacher/components/NewHeader";
import SecurityIndicator from "../components/SecurityIndicator";
import { FaEdit, FaSave, FaTimes, FaUserCircle, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaHeart, FaAddressCard, FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";
import ComplianceSection from "../components/ComplianceSection";

interface TeacherProfile {
    id: number;
    teacher_id: string;
    name: string;
    email: string;
    mobile: string;
    subject: string;
    qualification: string;
    date_of_birth?: string;
    gender?: string;
    highest_qualification?: string;
    experience_years: number;
    bio?: string;
    boards: string[];
    subject_classes: Record<string, string[]>;
    languages_known: string[];
    teaching_experience_institutes: string[];
    cv_file?: string;
    achievements_file?: string;
    experience_proof_file?: string;
    profile_picture?: string;
    degree_certificate?: string;
    degree_certificate_file?: string;
    profile_completed: boolean;
    is_active: boolean;
    document_status: string;
}

const TeacherInfo: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
    const [selectedSubjectClasses, setSelectedSubjectClasses] = useState<Record<string, string[]>>({});
    const [, navigate] = useLocation();

    const interests = [
        'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 
        'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 
        'Arabic', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 
        'Punjabi', 'Urdu', 'Malayalam', 'Kannada', 'Odia', 'Sanskrit'
    ];

    const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
    const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const subjectOptions = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science'];

    const [formData, setFormData] = useState<TeacherProfile>({
        id: 0,
        teacher_id: '',
        name: '',
        email: '',
        mobile: '',
        subject: '',
        qualification: '',
        date_of_birth: '',
        gender: '',
        highest_qualification: '',
        experience_years: 0,
        bio: '',
        boards: [],
        subject_classes: {},
        languages_known: [],
        teaching_experience_institutes: [],
        cv_file: '',
        achievements_file: '',
        experience_proof_file: '',
        profile_picture: '',
        degree_certificate: '',
        degree_certificate_file: '',
        profile_completed: false,
        is_active: false,
        document_status: ''
    });

    useEffect(() => {
        const session = SessionManager.getSession();
        if (!session || session.role !== 'teacher') {
            navigate('/login');
            return;
        }
        const teacherSession = session as TeacherSession;
        setTeacherSession(teacherSession);
        console.log('Teacher session:', teacherSession);

        setFormData(prev => ({
            ...prev,
            id: teacherSession.id,
            teacher_id: teacherSession.teacher_id,
            name: teacherSession.name,
            email: teacherSession.email,
            mobile: teacherSession.phone,
            subject: teacherSession.subject_specialization,
        }));

        // Use teacher_id or id as fallback
        const teacherId = teacherSession.teacher_id || teacherSession.id;
        if (teacherId) {
            fetchTeacherData(teacherId.toString());
        } else {
            console.error('No teacher ID found in session');
        }
    }, [navigate]);

    const fetchTeacherData = async (teacherId: string) => {
        try {
            console.log('Fetching teacher data for ID:', teacherId);
            const response = await fetch(`http://localhost:8001/api/auth/get_teacher/?teacher_id=${teacherId}`);
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Received teacher data:', data);
                
                if (data.status === 'success') {
                    console.log('Setting form data with:', data.data);
                    setFormData(prev => ({
                        ...prev,
                        ...data.data,
                    }));

                    if (data.data.languages_known && Array.isArray(data.data.languages_known)) {
                        console.log('Setting languages_known:', data.data.languages_known);
                        setSelectedInterests(data.data.languages_known);
                    }
                    if (data.data.boards && Array.isArray(data.data.boards)) {
                        setSelectedBoards(data.data.boards);
                    }
                    if (data.data.subject_classes && typeof data.data.subject_classes === 'object') {
                        setSelectedSubjectClasses(data.data.subject_classes);
                    }
                } else {
                    console.error('API returned error status:', data);
                }
            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching teacher data:', error);
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
                languages_known: newInterests
            }));
            return newInterests;
        });
    };

    const handleBoardToggle = (board: string) => {
        setSelectedBoards(prev => {
            const newBoards = prev.includes(board)
                ? prev.filter(b => b !== board)
                : [...prev, board];
            setFormData(prevForm => ({ ...prevForm, boards: newBoards }));
            return newBoards;
        });
    };

    const handleSubjectClassChange = (subject: string, classes: string[]) => {
        setSelectedSubjectClasses(prev => {
            const newSubjectClasses = { ...prev, [subject]: classes };
            setFormData(prevForm => ({ ...prevForm, subject_classes: newSubjectClasses }));
            return newSubjectClasses;
        });
    };

    const addSubject = () => {
        const subject = prompt('Enter subject name:');
        if (subject && !selectedSubjectClasses[subject]) {
            handleSubjectClassChange(subject, []);
        }
    };

    const removeClass = (subject: string, classToRemove: string) => {
        setSelectedSubjectClasses(prev => {
            const newSubjectClasses = {
                ...prev,
                [subject]: prev[subject].filter(cls => cls !== classToRemove)
            };
            setFormData(prevForm => ({ ...prevForm, subject_classes: newSubjectClasses }));
            return newSubjectClasses;
        });
    };

    const handleSave = async () => {
        const confirmed = window.confirm("Are you sure you want to save these changes?");
        if (!confirmed) {
            fetchTeacherData(formData.teacher_id);
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:8001/api/auth/update_teacher/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
                setIsEditing(false);
                fetchTeacherData(formData.teacher_id);
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update profile ❌' });
            }
        } catch (error) {
            console.error('Network error on save:', error);
            setMessage({ type: 'error', text: 'Network connection failed. Please check your server connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setMessage(null);
        fetchTeacherData(formData.teacher_id);
    };

    return (
        <div className="dashboard-container">
            <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
                <NewHeader
                    avatar={getAvatarUrl('teacher')}
                    name={teacherSession?.name || 'Teacher'}
                    role="Teacher"
                    searchPlaceholder="Search..."
                />
                <div className="student-info-page">
            {message && (
                <div className={`notification-message ${message.type}`}>
                    {message.text}
                    <button onClick={() => setMessage(null)} className="close-btn">×</button>
                </div>
            )}

            <div className="profile-card-container">
                <div className="profile-header-visual">
                    <div className="avatar-group">
                        <img
                            src={formData.profile_picture || getAvatarUrl('teacher')}
                            alt={formData.name}
                            className="profile-image-large"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getAvatarUrl('teacher');
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
                        <p className="profile-id-tag">Teacher ID: **{formData.teacher_id}**</p>
                        <SecurityIndicator userId={formData.id} userType="teacher" showDetails={true} />
                    </div>

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

            <div className="info-main-grid">
                <div className="info-column">
                    <div className="info-card">
                        <h2 className="info-card-header"><FaUserCircle className="header-icon"/> Personal Details</h2>
                        <div className="info-data-grid">
                            <InfoField label="Teacher Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} type="text" icon={<FaUserCircle />} />
                            <InfoField label="Date of Birth" name="date_of_birth" value={formData.date_of_birth} isEditing={isEditing} onChange={handleInputChange} type="date" placeholder="Not provided" icon={<FaCalendarAlt />} />
                            <InfoField label="Teacher ID" name="teacher_id" value={formData.teacher_id} isEditing={false} type="text" readOnly={true} icon={<FaAddressCard />} />
                        </div>
                    </div>

                    <div className="info-card">
                        <h2 className="info-card-header"><FaChalkboardTeacher className="header-icon"/> Professional Details</h2>
                        <div className="info-data-grid">
                            <InfoField label="Subject Specialization" name="subject" value={formData.subject} isEditing={isEditing} onChange={handleInputChange} type="text" icon={<FaGraduationCap />} />
                            <InfoField label="Qualification" name="qualification" value={formData.qualification} isEditing={isEditing} onChange={handleInputChange} type="text" placeholder="Not provided" icon={<FaGraduationCap />} />
                            <InfoField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification} isEditing={isEditing} onChange={handleInputChange} type="text" placeholder="Not provided" icon={<FaGraduationCap />} />
                            <InfoField label="Experience (Years)" name="experience_years" value={formData.experience_years?.toString()} isEditing={isEditing} onChange={handleInputChange} type="number" placeholder="0" icon={<FaChalkboardTeacher />} />
                            <InfoField label="Gender" name="gender" value={formData.gender} isEditing={isEditing} onChange={handleInputChange} type="select" options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} placeholder="Not provided" icon={<FaUserCircle />} />
                        </div>
                    </div>

                    <div className="info-card">
                        <h2 className="info-card-header"><FaChalkboardTeacher className="header-icon"/> Teaching Classes</h2>
                        <div className="teaching-classes-display">
                            {isEditing ? (
                                <div>
                                    {Object.entries(selectedSubjectClasses).map(([subject, classes]) => (
                                        <div key={subject} style={{marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                                <h4 style={{margin: 0, color: '#2c3e50'}}>{subject}</h4>
                                                <button type="button" onClick={() => removeSubject(subject)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '2px 6px', borderRadius: '3px', fontSize: '12px'}}>Remove</button>
                                            </div>
                                            
                                            {/* Selected Classes */}
                                            <div style={{marginBottom: '10px'}}>
                                                <strong>Selected Classes:</strong>
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                                                    {classes.map(cls => (
                                                        <span key={cls} style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            background: '#3498db',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            gap: '5px'
                                                        }}>
                                                            Class {cls}
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleSubjectClassChange(subject, classes.filter(c => c !== cls))}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.3)',
                                                                    border: 'none',
                                                                    color: 'white',
                                                                    borderRadius: '50%',
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    fontSize: '10px',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Add Class Dropdown */}
                                            <div>
                                                <strong>Add Class:</strong>
                                                <select 
                                                    onChange={(e) => {
                                                        if (e.target.value && !classes.includes(e.target.value)) {
                                                            handleSubjectClassChange(subject, [...classes, e.target.value]);
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                    style={{width: '100%', padding: '5px', marginTop: '5px'}}
                                                >
                                                    <option value="">Select a class to add</option>
                                                    {classOptions.filter(cls => !classes.includes(cls)).map(cls => (
                                                        <option key={cls} value={cls}>Class {cls}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {formData.subject_classes && Object.keys(formData.subject_classes).length > 0 ? (
                                        Object.entries(formData.subject_classes).map(([subject, classes]) => (
                                            <div key={subject} className="subject-classes-item">
                                                <h4 style={{margin: '10px 0 5px 0', color: '#2c3e50'}}>{subject}:</h4>
                                                <div className="classes-tags">
                                                    {Array.isArray(classes) ? classes.map(cls => (
                                                        <span key={cls} className="class-tag" style={{
                                                            display: 'inline-block',
                                                            background: '#3498db',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            margin: '2px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px'
                                                        }}>
                                                            Class {cls}
                                                        </span>
                                                    )) : null}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="not-provided">No teaching classes assigned</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-card">
                        <h2 className="info-card-header"><FaGraduationCap className="header-icon"/> Boards</h2>
                        <div className="boards-selection-area">
                            {isEditing ? (
                                <div className="interests-grid-edit">
                                    {boardOptions.map(board => (
                                        <button
                                            key={board}
                                            type="button"
                                            className={`interest-tag ${selectedBoards.includes(board) ? 'selected' : ''}`}
                                            onClick={() => handleBoardToggle(board)}
                                        >
                                            {board} {selectedBoards.includes(board) && <FaHeart className="heart-icon" />}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="interests-display">
                                    {selectedBoards.length > 0 ? (
                                        selectedBoards.map(board => (
                                            <span key={board} className="interest-tag-display">
                                                {board} <FaHeart className="heart-icon" />
                                            </span>
                                        ))
                                    ) : (
                                        <p className="not-provided">No boards selected</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-card">
                        <h2 className="info-card-header"><FaGraduationCap className="header-icon"/> Bio & Experience</h2>
                        <div className="info-data-grid">
                            <InfoField label="Bio" name="bio" value={formData.bio} isEditing={isEditing} onChange={handleInputChange} type="textarea" placeholder="Tell us about yourself..." icon={<FaUserCircle />} fullWidth={true} />
                            <InfoField label="Document Status" name="document_status" value={formData.document_status} isEditing={false} type="text" readOnly={true} icon={<FaAddressCard />} />
                        </div>
                    </div>
                </div>

                <div className="info-column">
                    <div className="info-card">
                        <h2 className="info-card-header"><FaPhone className="header-icon"/> Contact Information</h2>
                        <div className="info-data-grid">
                            <InfoField label="Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} type="email" icon={<FaEnvelope />} />
                            <InfoField label="Phone Number" name="mobile" value={formData.mobile} isEditing={isEditing} onChange={handleInputChange} type="tel" icon={<FaPhone />} />
                        </div>
                    </div>

                    <div className="info-card">
                        <h2 className="info-card-header"><FaHeart className="header-icon"/> Languages & Skills</h2>
                        <div className="interests-selection-area">
                            {isEditing ? (
                                <div>
                                    {/* Selected Languages/Skills */}
                                    {selectedInterests.length > 0 && (
                                        <div style={{marginBottom: '15px'}}>
                                            <strong>Selected:</strong>
                                            <div className="interests-display" style={{marginTop: '5px'}}>
                                                {selectedInterests.map(interest => (
                                                    <span key={interest} className="interest-tag-display" style={{position: 'relative'}}>
                                                        {interest} 
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleInterestToggle(interest)}
                                                            style={{
                                                                background: 'rgba(255,255,255,0.3)',
                                                                border: 'none',
                                                                color: '#e74c3c',
                                                                borderRadius: '50%',
                                                                width: '16px',
                                                                height: '16px',
                                                                fontSize: '12px',
                                                                cursor: 'pointer',
                                                                marginLeft: '5px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Available Languages/Skills */}
                                    <div>
                                        <strong>Available:</strong>
                                        <div className="interests-grid-edit" style={{marginTop: '5px'}}>
                                            {interests.filter(interest => !selectedInterests.includes(interest)).map(interest => (
                                                <button
                                                    key={interest}
                                                    type="button"
                                                    className="interest-tag"
                                                    onClick={() => handleInterestToggle(interest)}
                                                >
                                                    {interest}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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
                                        <p className="not-provided">No languages/skills selected. Click 'Update Profile' to add some!</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <ComplianceSection userId={formData.id} userType="teacher" />
                </div>
            </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherInfo;

interface InfoFieldProps {
    label: string;
    name: string;
    value: string | undefined;
    isEditing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    type: 'text' | 'tel' | 'date' | 'select' | 'textarea' | 'email' | 'number';
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


