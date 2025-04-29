import React, { useState, useEffect } from 'react';
import './Register.css'; // Create this CSS file

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (!user.name || !user.email || !user.password) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setSuccess(true);
                setUser({ name: '', email: '', password: '', role: '' }); // Reset form
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                
                {success && (
                    <div className="success-message">
                        ✅ Registration successful! Redirecting...
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john@example.com"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            placeholder="Role (e.g., delivery, customer)"
                            value={user.role}
                            onChange={handleChange}
                            required
                        />
                    </div>
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <a href="/login" className="auth-link">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;