import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { toast } from 'react-toastify';
import './dashboard.css';

const Dashboard = (props) => {

    const token = useRef('');
    const id = useRef('');
    const [data, setData] = useState({
        'user': [],
        'camCount': 0,
        'criminalCount': 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            toast('Please login to continue');
            navigate('/');
        }
        else {
            token.current = sessionStorage.getItem('token');
            id.current = sessionStorage.getItem('id');
            
            const url = "http://127.0.0.1:5000/api/dashboard";
            const formdata = new FormData();
            formdata.append("token", token.current);
            formdata.append("id", id.current);
            try {
                fetch(url, {
                    method: "POST",
                    body: formdata,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setData(prevData => {
                            return {
                                ...prevData,
                                user: data.user,
                                camCount: data.camCount,
                                criminalCount: data.criminalCount
                            }
                        }
                        );
                        props.setLoading(false);
                    }
                    else {
                        toast(data.message);
                        navigate('/');
                    }
                })
                .catch((error) => {
                    toast('Error:', error);
                    props.setLoading(false);
                });
            }
            catch (error) {
                toast('Error:', error);
                props.setLoading(false);
            }
        }
    }, []);

    return (
        <>
            <div className={props.showNav ? "nav-container" : "nav-container hide"}>
                <Navbar setLoading={props.setLoading} />
            </div>
            <div className={ props.showNav ? "main-container" : "main-container expand-main"}>
                <div className="top-section">
                    <button className="nav-toogle" onClick={props.toggleNav}>
                        <FaBars />
                    </button>
                    <div className="user-details">
                        <span className="user-name">{data.user[1]}</span>
                    </div>
                </div>
                <div className='main-section'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-title'>Total Cameras</div>
                        </div>
                        <div className='card-body'>
                            <div className='card-value'>{data.camCount}</div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-title'>Total Criminals</div>
                        </div>
                        <div className='card-body'>
                            <div className='card-value'>{data.criminalCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
}

export default Dashboard;   