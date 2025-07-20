import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Dashboard";
import Login from "./Login";
import CamList from "./CamList";
import Cam from "./Cam";
import Log from "./Log";
import Criminals from "./Criminals";

function App() {

  const [showNav, setShowNav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('showNav') === 'true') {
      setShowNav(true);
    }
  }, []);

  const toggleNav = () => {
    localStorage.setItem('showNav', !showNav);
    setShowNav(!showNav);
  }

  return (
    <>
      <ToastContainer />
      {loading && <div className='loader'><TailSpin /></div>}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setLoading={setLoading}></Login>} />
          <Route path="/dashboard" element={<Dashboard showNav={showNav} toggleNav={toggleNav} setLoading={setLoading}></Dashboard>} />
          <Route path="/camlist" element={<CamList showNav={showNav} toggleNav={toggleNav} setLoading={setLoading}></CamList>} />
          <Route path="/cam/:camid" element={<Cam showNav={showNav} toggleNav={toggleNav} setLoading={setLoading}></Cam>} />
          <Route path="/log" element={<Log showNav={showNav} toggleNav={toggleNav} setLoading={setLoading}></Log>} />
          <Route path="/criminals" element={<Criminals showNav={showNav} toggleNav={toggleNav} setLoading={setLoading}></Criminals>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
