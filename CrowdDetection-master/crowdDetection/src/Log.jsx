import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { toast } from 'react-toastify';
import './log.css';

const Log = (props) => {

    const token = useRef('');
    const id = useRef('');
    const [data, setData] = useState({
        'user': [],
        'logs': [],
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
            
            const url = "http://127.0.0.1:5000/api/logs";
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
                                logs: data.logs,
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
                    <div className="log-container">
                        <h1>Logs</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Camera Id</th>
                                    <th>Criminal Image</th>
                                    <th>Found Image</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.logs.map((log, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{log[0]}</td>
                                            <td><a href={`/cam/${log[1]}`}>{log[1]}</a></td>
                                            <td><img src={"http://127.0.0.1:5000/static/" + log[2]} className='image' alt="person" /></td>
                                            <td><img src={"http://127.0.0.1:5000/static/" + log[3]} className='image' alt="person" /></td>
                                            <td>{log[4]}</td>
                                        </tr>
                                    );
                                })}
                                {data.logs.length === 0 && <tr><td colSpan="5">No logs available</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
        );
}

export default Log;   