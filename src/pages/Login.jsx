import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../services/allAPI';

function Login() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = userData;
        if (!email || !password) {
            alert('Please fill the form completely');
        } else {
            try {
                const result = await loginAPI(userData);
                console.log(result);

                if (result.status === 200) {
                    sessionStorage.setItem('existingUser',JSON.stringify(result.data.existingUser))
                    sessionStorage.setItem("token", result.data.token)
                    alert('Login successful');
                    navigate('/'); // redirect to dashboard or any other route
                } else {
                    alert(result.data || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please check your credentials.');
            }
        }
    }

    return (
        <div>
            <section className='px-3 loginback'>
                <div className='w-50 mx-auto rounded border border-solid align-items-center justify-content-center shadow-lg p-3 mb-3 bg-white rounded login mt-3'>
                    <h3 className='text-center mb-3'>Hello! <span className='text-light'>Welcome Back!!!</span></h3>
                    <form className='' onSubmit={handleLogin}>
                        <div className='d-flex align-items-center justify-content-center'>
                            <input
                                type="email"
                                placeholder='Enter Your Email'
                                name='email'
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className='w-75 rounded border border-solid align-items-center justify-content-center shadow-lg p-3 mb-2 bg-white rounded'
                            />
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <input
                                type="password"
                                placeholder='Enter Your Password'
                                name='password'
                                value={userData.password}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                className='w-75 rounded border border-solid align-items-center justify-content-center shadow-lg p-3 mb-3 bg-white rounded'
                            />
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <button className='btn btn-success w-75' type='submit'>Login</button>
                        </div>
                        <div>
                            <p className='name mt-2 d-flex align-items-center justify-content-center'>Don't have an account? <Link style={{ textDecoration: 'none' }} to={'/register'}>Register</Link></p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Login;
