import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShopContext } from '../Context/Context';
import '../Pages/CSS/Login.css';
import Footer from "../Components/Footer/Footer";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useContext(ShopContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });

            if (response.data) {
                loginUser(response.data); // Save user data to context and localStorage
                navigate('/loginsuccess');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <div>
            <div className="login">
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Login;