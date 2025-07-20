import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBars } from "react-icons/fa";
import './cam.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cam = (props) => {

    const token = useRef('');
    const id = useRef('');
    const [data, setData] = useState({
        'user': [],
        'camCount': 0,
        'criminalCount': 0
    });
    const navigate = useNavigate();
    const { camid } = useParams();

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            toast('Login again');
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
                    toast(data.message);
                    props.setLoading(false);
                });
            }
            catch (error) {
                toast(data.message);
                props.setLoading(false);
            }
        }
    }, []);

    return (
        <>
            <div className={props.showNav ? "nav-container" : "nav-container hide"}>
                <Navbar />
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
                    <div className="cam-details">
                        <h2 className="cam-name">Camera { 1 + parseInt(camid) }</h2>
                        <div className='video-container'>
                            <img src={`http://127.0.0.1:5000/api/video_feed/${camid}`} alt="Camera" className='video-stream' />
                        </div>
                        <div className='activity'>
                            <h4>Activity</h4>
                            <ul>
                                <li>
                                    <span className='criminal-name'>Criminal Name</span><span className='time'>Time</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
}

export default Cam;   