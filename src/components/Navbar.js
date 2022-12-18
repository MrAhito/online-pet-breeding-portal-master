import React, { useState, useEffect } from 'react'
import logo from '../images/logo.png'
import logo2 from '../images/icon.png'
import './Navbar.css';
import * as aIIc from 'react-icons/ai'
import { UNavData } from '../data/NavData';
import DropDownDiv from './DropDownDiv';
import { getDoc } from '../Functions/Functions';
import firebase, { auth } from '../config/firebase';

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

function useCurrentWidth() {
  let [width, setWidth] = useState(getWidth());

  const [toogle, settoogle] = useState(true)
  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
      if (getWidth() <= 750) {
        settoogle(true);
      } else {
        settoogle(false);
      }
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, [width])

  return toogle;
}
function Navbar(props) {
  const hideDrop = props.hideDrop;
  const [toogle, settoogle] = useState(true);
  const [setSeen, setSSeen] = useState(false);
  // const [notifCount, setnotifCount] = useState(0)
  const [breedReq, setbreedReq] = useState(false)
  const href = undefined;
  const width = !useCurrentWidth();
  const dashT = props.hd;
  const sd = props.sd;
  const [drop, setdrop] = useState("");
  const [USer, setUSer] = useState([]);


  const getAllMEssages = async () => {
    var a = 0;
    const mesRef = await firebase
      .collection(`users/${auth.currentUser.uid}/messages/`)
      .orderBy("timestamp", "desc")
      .get();
    if (!(mesRef.empty)) {
      mesRef.docs.map((doc) => { if (doc.data().seened === false) { a++; } return true; });
      if (a >= 1) {
        setSSeen(true);
      } else {
        setSSeen(false);
      }
    }
  }

  const getPending = () => {
    var a = 0;
    firebase.collection("Notifications").where("to", "==", auth.currentUser.uid).onSnapshot(snaps => {
      if (!(snaps.empty)) {
        snaps.docs.map((doc) => { if (doc.data().viewedByReciever === false) { a++; } return a; });
        setbreedReq(true);
      } else {
        setbreedReq(false);
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          getDoc(firebase, auth.currentUser.uid).then(data => { setUSer(data) });
          getAllMEssages();
          getPending();
        }
      })
    });
    return () => clearInterval(interval);
  }, [])

  return (
    <>
      <div className='NavBar'>
        <div className='nav-wrapper'>
          <a href=' ' className='logo1'><img src={logo} alt='logo' /></a>
          <a href=' ' className='logo2'><img src={logo2} alt='logo' /></a>

          {sd === "home" && <>
            <ul className={toogle || width ? 'menus' : 'nav-open'}>
              <li className={toogle || width ? 'mlist' : 'list-open'}><a href='#home' onClick={() => { settoogle(true); }} className={toogle || width ? 'lista' : 'li-open'}>HOME</a></li>
              <li className={toogle || width ? 'mlist' : 'list-open'}><a href='#features' onClick={() => { settoogle(true); }} className={toogle || width ? 'lista' : 'li-open'}>FEATURES</a></li>
              <li className={toogle || width ? 'mlist' : 'list-open'}><a href='#team' onClick={() => { settoogle(true); }} className={toogle || width ? 'lista' : 'li-open'}>ABOUT US</a></li>
              <li className={toogle || width ? 'mlist' : 'list-open'}><a href='/log-in' style={{ marginTop: "-.75vh", fontSize: "2.5vh", textDecoration: "none" }} className='btn-log'>LOG - IN</a></li>
            </ul>
            <label className='menuNav' htmlFor="checkbox" >
              <input type="checkbox" id="checkbox" className='navcheck' checked={!toogle} readOnly hidden />
              <aIIc.AiOutlineMenu className='menuNav' onClick={() => { settoogle(!toogle); }} />
            </label>
          </>}
          {sd === "reg" &&
            <>
              <div className='Exist'>
                <p>Already have account? </p>
                <button className='btn-log' onClick={() => { window.location.href = '/log-in' }}>Login</button>
              </div>
            </>}
          {sd === "guest" &&
            <>
              <div className='Exist'>
                <p>No account yet? </p>
                <button className='btn-log' onClick={() => { window.location.href = '/register-guest' }}>Register</button>
                <p>Already have account? </p>
                <button className='btn-log' onClick={() => { window.location.href = '/log-in' }}>Login</button>
              </div>
            </>}
          {sd === 'dash' &&
            <>
              <ul className='dashBtns'>
                {
                  UNavData.map((item, index) => {
                    return (
                      <li key={index} onClick={() => { window.location.href = item.to }} className={dashT === item.title ? 'dashOn' : 'dashOff'} title={item.title}><a href={item.to}>{item.icon}</a></li>
                    )
                  })
                }
              </ul>
              <p className='optUse' title='Options'><aIIc.AiOutlineEllipsis /></p>
              <ul className='userBtns'>
                <li onClick={() => { setdrop("Profile") }} title={"Profile"}><a className={props.jd === "Profile" || drop === "Profile" ? 'useT profa on' : 'useT profa'} href="/profile">
                  {USer.profile ? <div className='dp-wrapper porda'><img className='adProp' src={USer.profile} alt='dp' /></div> : <div style={{ backgroundColor: USer.bgColor }} className='dp-wrapper porda' >{USer.first_name && USer.first_name[0]}</div>}</a></li>
                <li onClick={() => { setdrop("Messages") }} title={"Messages"}><a className={props.jd === "Messages" || drop === "Messages" ? 'useT on' : 'useT'} href={href} ><aIIc.AiOutlineMessage /> <span className='optTitle'>{"Messages"}</span> </a>
                  {setSeen && <div className='isOnline seent'></div>}
                </li>
                <li onClick={() => { setdrop("Notification") }} title={"Notification"}><a className={props.jd === "Notification" || drop === "Notification" ? 'useT on' : 'useT'} href={href} ><aIIc.AiOutlineBell /> <span className='optTitle'>{"Notification"}</span> </a>
                  {breedReq && <div className='isOnline seent'></div>}
                </li>
                <li onClick={() => { setdrop("Setting") }} title={"Setting"}><a className={props.jd === "Setting" || drop === "Setting" ? 'useT on' : 'useT'} href={href} ><aIIc.AiOutlineSetting /> <span className='optTitle'>{"Setting"}</span> </a></li>
              </ul>
            </>}
        </div>
      </div>
      {drop !== "" && hideDrop !== "" && drop !== "Profile" &&
        <>
          <DropDownDiv user={USer} drop={drop} hideDrop={() => { setdrop("") }} />
          <div onClick={() => { setdrop("") }} className='optB'></div>
        </>}
    </>
  )
}

export default Navbar
