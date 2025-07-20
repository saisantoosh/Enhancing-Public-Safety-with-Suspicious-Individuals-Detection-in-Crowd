import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { FaBars } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './log.css'

const Criminals = (props) => {

    const token = useRef('');
    const id = useRef('');
    const [data, setData] = useState({
        'user': [],
        'criminals': [],
    });
    const navigate = useNavigate();
    const [criminalName, setCriminalName] = useState('');
    const [criminalImage, setCriminalImage] = useState('');

    const onChangeCriminalName = (e) => {
        setCriminalName(e.target.value);
    }

    const onChangeCriminalImage = (e) => {
        setCriminalImage(e.target.files[0]);
    }

    const addCriminal = (e) => {
        e.preventDefault();
        if(criminalName === '' || criminalImage === '') {
            toast('Please fill all the fields');
            return;
        }
        props.setLoading(true);
        const url = "http://127.0.0.1:5000/api/add_criminal";
        const formdata = new FormData();
        formdata.append("token", token.current);
        formdata.append("id", id.current);
        formdata.append("name", criminalName);
        formdata.append("image", criminalImage);
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
                            criminals: data.criminals,
                        }
                    });
                    setCriminalName('');
                    setCriminalImage('');
                    props.setLoading(false);
                    toast(data.message);
                }
                else {
                    if (data.message === 'Invalid credentials') {
                        toast(data.message);
                        navigate('/');
                    }
                    else {
                        toast(data.message);
                        props.setLoading(false);
                    }
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

    const deleteCriminal = async (criminalId) => {
        const formData = new FormData();
        formData.append("token", token.current);
        formData.append("id", id.current);
        formData.append("criminal_id", criminalId);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/delete_criminal", {
                method: "POST",
                body: formData
            });
            const dataResp = await response.json();
            if (dataResp.status === "success") {
                toast("Criminal deleted successfully");
                setData(prevData => {
                    return {
                        ...prevData,
                        criminals: prevData.criminals.filter(c => c[0] !== criminalId)
                    };
                });
            } else {
                toast("Deletion failed: " + dataResp.message);
            }
        } catch (error) {
            console.error("Error deleting criminal:", error);
            toast("An error occurred");
        }
    }

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            toast('Please login to continue');
            navigate('/');
        }
        else {
            token.current = sessionStorage.getItem('token');
            id.current = sessionStorage.getItem('id');

            const url = "http://127.0.0.1:5000/api/get_criminals";
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
                                criminals: data.criminals,
                            }
                        });
                        props.setLoading(false);
                    }
                    else {
                        toast(data.message);
                        navigate('/');
                    }
                })
                .catch((error) => {
                    toast('Error:'+ error);
                    props.setLoading(false);
                });
            }
            catch (error) {
                toast('Error:'+ error);
                props.setLoading(false);
            }
        }
    }, []);

    return (
        <>
            <div className={props.showNav ? "nav-container" : "nav-container hide"}>
                <Navbar  setLoading={props.setLoading} />
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
                    <div className='criminals-container'>
                        <h2>Criminals</h2>
                        <form>
                            <div>
                                <label>Criminal Name:</label>
                                <input type='text' placeholder='Criminal Name' value={criminalName} onChange={onChangeCriminalName} />
                            </div>
                            <input type='file' onChange={onChangeCriminalImage} />
                            <button className='btn' type='button' onClick={addCriminal}>Add Criminal</button>
                        </form>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.criminals?.map((criminal, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{criminal[0]}</td>
                                            <td>{criminal[1]}</td>
                                            <td><img src={"http://127.0.0.1:5000/static/" + criminal[2]} className='image' alt={criminal[1]} /></td>
                                            <td><button onClick={() => deleteCriminal(criminal[0])} className='btn delete-btn'>Delete</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Criminals;
