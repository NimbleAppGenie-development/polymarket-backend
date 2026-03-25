import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Loader from "../components/Loader";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const Navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const response = await axios.post(
                `${apiBaseUrl}/api/admin/login`,
                { email, password }
            );

            const { data, token, success } = response.data;
            if (success) {
                if (token) {
                    const timeDel = Date.now() + 3600000

                    localStorage.setItem('UserToken', token);
                    localStorage.setItem('UserTokenExpiry', timeDel);

                    toast.success('Login successful.');
                    setMessage('Login successful!');
                    Navigate('/');
                } else {
                    toast.error('Token not found in response.');
                }
            } else {
                console.log("Response error data:", data);
                toast.error(`${data.message || 'Login failed'}`);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred';
            const errorStatus = error?.response?.status;

            console.error("Login error:", {
                status: errorStatus,
                message: errorMessage,
                fullError: error
            });

            toast.error(`${errorMessage}`);
        }

    };

    return (
        <>
            <Loader open={loading} />
            <div
                style={{
                    maxWidth: 400,
                    margin: '5rem auto',
                    padding: '2.5rem 3rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    backgroundColor: '#fff',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '1.8rem', color: '#333' }}>
                    Admin Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="email"
                            style={{ display: 'block', marginBottom: 6, fontWeight: '600', color: '#555' }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.65rem 0.8rem',
                                fontSize: 16,
                                borderRadius: 6,
                                border: '1.5px solid #ccc',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                            autoComplete="username"
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="password"
                            style={{ display: 'block', marginBottom: 6, fontWeight: '600', color: '#555' }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.65rem 0.8rem',
                                fontSize: 16,
                                borderRadius: 6,
                                border: '1.5px solid #ccc',
                                outline: 'none',
                                transition: 'border-color 0.3s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#fff',
                            backgroundColor: '#007bff',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                    >
                        Login
                    </button>
                </form>
                {message && (
                    <p
                        style={{
                            marginTop: '1.5rem',
                            textAlign: 'center',
                            color: message.includes('success') ? 'green' : 'red',
                            fontWeight: '600',
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </>
    );

};

export default LoginPage;
