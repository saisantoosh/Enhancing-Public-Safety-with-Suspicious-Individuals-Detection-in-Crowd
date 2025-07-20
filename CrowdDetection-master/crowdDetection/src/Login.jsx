import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  { TailSpin }  from "react-loader-spinner";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import './login.css';


const Login = (props) => {

    const [loginData, setLoginData] = useState({"email": "", "password": ""});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeEmail = (e) => {
        setLoginData({...loginData, email: e.target.value});
    }

    const onChangePassword = (e) => {
        setLoginData({...loginData, password: e.target.value});
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:5000/api/login";
        const formdata = new FormData();
        formdata.append("email", loginData.email);
        formdata.append("password", loginData.password);
        try {
            fetch(url, {
                method: "POST",
                body: formdata,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('id', data.id);
                    toast(data.message);
                    navigate('/dashboard');
                }
                else {
                    toast('Error:'+ data.message);
                    props.setLoading(false);
                }
            })
            .catch((error) => {
                toast('Error:'+ error);
            });
        }
        catch (error) {
            toast('Error:'+ error);
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            navigate('/dashboard');
        }
        props.setLoading(false);
    }, []);

    return (
        <div className='login-bg'>
            <form className='container' onSubmit={onSubmit}>
                <div className='header'>
                    <div className='text'>Login</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>
                    <div className='input'>
                        <MdOutlineMail className='icon' />
                        <input type="username" placeholder='Email Id' value={loginData.email} onChange={onChangeEmail} />
                    </div>
                    <div className='input'>
                        <RiLockPasswordLine className='icon' />
                        <input type="password" placeholder='Password' value={loginData.password} onChange={onChangePassword} />
                    </div>
                </div>
                
                <div className='forgot-password'>Lost Password <span>Click Here!</span></div>
                
                <div className='submit-container'>
                    <button className='submit' >Login </button>
                </div>
            </form>
        </div>
    );
}

export default Login;