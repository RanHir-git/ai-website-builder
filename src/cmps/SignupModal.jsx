import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            await register({ email, password, name });
            onClose();
        } catch (err) {
            setError(err.message || "Failed to sign up");
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col justify-center w-full max-w-md rounded-xl px-8 py-10 border border-slate-700 bg-slate-900 text-white text-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Sign Up</h2>
                            <button 
                                onClick={onClose}
                                className="text-slate-400 hover:text-white text-xl bg-transparent close-modal-btn"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-slate-300 mt-1">Create a new account</p>
                        <form className="mt-8" onSubmit={handleSubmit}>
                            {error && (
                                <div className="mb-4 p-2 bg-red-900/50 text-red-300 rounded text-sm">
                                    {error}
                                </div>
                            )}
                            <label htmlFor="name" className="block mb-1 font-medium text-slate-300">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Your name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />

                            <label htmlFor="email" className="block mb-1 font-medium text-slate-300">Email address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />

                            <label htmlFor="password" className="block mb-1 font-medium text-slate-300">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />

                            <label htmlFor="confirmPassword" className="block mb-1 font-medium text-slate-300">Verify Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" 
                                required
                            />
                            
                            <button 
                                type="submit" 
                                className="w-full mt-10 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Sign up
                            </button>
                            <div className="mt-4 text-center">
                                <span className="text-slate-400">Already have an account? </span>
                                <button 
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 switch-to-btn"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );

    return createPortal(modalContent, document.body);
}
