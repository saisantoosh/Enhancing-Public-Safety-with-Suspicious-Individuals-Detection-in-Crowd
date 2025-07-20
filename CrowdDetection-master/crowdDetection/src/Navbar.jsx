import { LuLayoutDashboard, LuFileStack } from "react-icons/lu";
import { RiCriminalLine } from "react-icons/ri";
import { GiCctvCamera } from "react-icons/gi";
import { IoIosLogOut, IoIosPeople } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const logout = () => {
        props.setLoading(true);
        const url = "http://localhost:5000/api/logout";
        const formdata = new FormData();
        formdata.append("token", sessionStorage.getItem('token'));
        try {
            fetch(url, {
                method: "POST",
                body: formdata,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('id');
                    props.setLoading(false);
                    toast(data.message);
                    navigate('/');
                }
            })
            .catch((error) => {
                props.setLoading(false);
                toast('Error:'+ error);
            });
        }
        catch (error) {
            props.setLoading(false);
            toast('Error:'+ error);
        }
    }

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <a className="brand" href="/dashboard">
                    <IoIosPeople className="brand-icon" />
                    <span>Crowd Detection</span>
                </a>
            </div>
            <ul className="nav-list">
                <li className={path.includes('/dashboard') ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="/dashboard">
                        <LuLayoutDashboard className="nav-icon" />
                        <span>Dashboard</span>
                    </a>
                </li>
                <li className={path.includes('/camlist') ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="/camlist">
                        <GiCctvCamera className="nav-icon" />
                        <span>Camera List</span>
                    </a>
                </li>
                <li className={path.includes('/log') ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="/log">
                        <LuFileStack className="nav-icon" />
                        <span>Log</span>
                    </a>
                </li>
                <li className={path.includes('/criminals') ? "nav-item active" : "nav-item"}>
                    <a className="nav-link" href="/criminals">
                        <RiCriminalLine className="nav-icon" />
                        <span>Criminals</span>
                    </a>
                </li>
            </ul>
            <div className="logout-section">
                <a className="logout-btn" onClick={logout}>
                    <IoIosLogOut className="logout-icon" />
                    <span>Logout</span>
                </a> 
            </div>
        </nav>
    );
}

export default Navbar;