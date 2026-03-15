import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaTimes } from 'react-icons/fa';
import './ProfileCompletionModal.css';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    role?: 'student' | 'teacher';
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
    isOpen,
    onClose,
    userName,
    role = 'student'
}) => {
    const [, navigate] = useLocation();

    if (!isOpen) return null;

    const isTeacher = role === 'teacher';

    return (
        <AnimatePresence>
            <motion.div
                className="profile-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="profile-modal-content"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <button className="profile-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>

                    <div className="profile-modal-header">
                        <div className="profile-modal-icon">
                            <FaUserEdit />
                        </div>
                        <h2>Complete Your Profile!</h2>
                        <p>Welcome, {userName}! 👋</p>
                    </div>

                    <div className="profile-modal-body">
                        {isTeacher ? (
                            <>
                                <p>
                                    To get verified and start teaching, please complete your educator profile.
                                </p>
                                <ul>
                                    <li>✅ Verify your credentials</li>
                                    <li>👥 Attract more students</li>
                                    <li>📈 Access advanced teaching tools</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p>
                                    To give you the best personalized learning experience, we need a few more details about you.
                                </p>
                                <ul>
                                    <li>📚 Tailored course recommendations</li>
                                    <li>🎯 Personalized learning paths</li>
                                    <li>🏆 Better progress tracking</li>
                                </ul>
                            </>
                        )}
                    </div>

                    <div className="profile-modal-footer">
                        <button
                            className="btn-later"
                            onClick={onClose}
                        >
                            I'll do it later
                        </button>
                        <button
                            className="btn-complete-now"
                            onClick={() => navigate(isTeacher ? '/teacher-info' : '/student-info')}
                        >
                            Complete Profile Now
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileCompletionModal;
