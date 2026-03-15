"use client";

import React, { useState } from "react";
import { useLocation } from "wouter";
import SessionManager from "../../utils/sessionManager";

const TeacherRegisterPage: React.FC = () => {
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience_years: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      console.log('Sending teacher registration data:', formData);
      
      const response = await fetch("http://localhost:8001/api/auth/teacher_register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          qualification: formData.qualification,
          experience_years: parseInt(formData.experience_years) || 0,
          password: formData.password,
        }),
      });

      console.log('Teacher registration response status:', response.status);
      const data = await response.json();
      console.log('Teacher registration response data:', data);

      if (response.ok) {
        setMessage(`✅ Teacher registered successfully! Your Teacher ID is: ${data.teacher_id}`);
        
        // Save session with proper teacher data
        SessionManager.saveSession({
          role: "teacher",
          teacherId: data.teacher_id,
          id: data.id,
          name: data.name,
          email: data.email
        });

        setTimeout(() => {
          navigate("/teacher-dashboard");
        }, 2000);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          qualification: "",
          experience_years: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(`❌ Error: ${data.error || data.message || "Failed to register teacher"}`);
      }
    } catch (err) {
      console.error('Teacher registration error:', err);
      setMessage("❌ Error: Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Teacher Registration
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "name", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "phone", type: "tel", placeholder: "Phone Number" },
            { name: "subject", type: "text", placeholder: "Subject" },
            { name: "qualification", type: "text", placeholder: "Qualification" },
            { name: "experience_years", type: "number", placeholder: "Experience (Years)", min: "0" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
          ].map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={(formData as any)[name]}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </button>
        </p>

        <p className="mt-2 text-center text-gray-500 text-sm">
          For help, contact{" "}
          <a href="mailto:support@eduyata.com">support@eduyata.com</a>
        </p>
      </div>
    </div>
  );
};

export default TeacherRegisterPage;
