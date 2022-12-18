import React, { Component } from 'react'
// import { brgyAbucay, brgyBagac, brgyBalanga, brgyDinalupihan, brgyHermosa, brgyLimay, brgyMariveles, brgyMorong, brgyOrani, brgyOrion, brgyPilar, brgySamal, Municipality } from '../data/data'
// import Map from '../Maps/Map'
import Progressbar from '../Functions/Progressbar'
import { createuser, randomColor } from '../Functions/Functions'
import firebase from "../config/firebase";
import './UserRegForm.css'


class UserRegForm extends Component {

    constructor() {
        super()
        this.state = {
            btnSign: true,
            regUtype: true,
            gendPos: false,
            utyPos: false,
            munPos: false,
            brgyPos: false,
            progPos: false,
            progEnd: false,

            Fname: '',
            Mname: '',
            Lname: '',
            utype: '',
            munSel: '',
            brgySel: '',
            Gender: '',
            Email: '',
            Number: '',
            Pass: '',
            Word: '',
            Addr: '',
            userBdate: '',
            backGroundColor: '',

            FNErr: false,
            LNErr: false,
            BDErr: false,
            GenErr: false,
            EAErr: false,
            NOErr: false,
            PSErr: false,
            APErr: false,
            MuErr: false,
            BrErr: false,
            UTErr: false,
            errorIn: 'Field with',
            errorInfo: ' * ',
            errorsubs: 'are required:'

        }
        this.selDate = this.selDate.bind(this);
    }

    sltChange(e, a) {
        if (a === 'utype') {
            this.setState({
                regUtype: false,
                utype: e.target.value,
            })
        }
        if (a === 'muni') {
            this.setState({
                munSel: e.target.value,
            })
        }


    }
    handlegend(a) {
        if (a === 'gendPos') {
            this.setState({ gendPos: true });
        }
        if (a === 'mun') {
            this.setState({ munPos: true });
        }
        if (a === 'brgy') {
            this.setState({ brgyPos: true });
        }
        if (a === 'uty') {
            this.setState({ utyPos: true });
        }
    }
    handleSlt(e, a) {
        if (e.target.value === "" && a === 'gendPos') {
            this.setState({ gendPos: false });
        }
        if (e.target.value === "" && a === 'mun') {
            this.setState({ munPos: false });
        }
        if (e.target.value === "" && a === 'brgy') {
            this.setState({ brgyPos: false });
        }
        if (e.target.value === "" && a === 'uty') {
            this.setState({ utyPos: false });
        }
    }
    selDate(e) {
        this.setState({ userBdate: e.target.value, });
    }
    handleText(a) {
        return a.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
    getSuggestions(a) {
        var requestOptions = {
            method: 'GET',
            location: { lat: () => 14.669793, lng: () => 120.541386 },
            radius: 500 * 1000,
        };

        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${a}&apiKey=3180dd98bdf6424383d1e28981882fb8`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.features.length > 0) {
                    this.setState({ suggestAddr: result.features, openSugg: true, })

                }
            })
            .catch(error => console.log('error', error));

    }
    setAddresa(a) {
        // console.log(a);
        this.setState({
            openSugg: false,
            Addr1: a.formatted,
            munSel: a.lat,
            brgySel: a.lon,
        })
    }
    handleSign() {
        // console.log(this.state.Addr1);
        // console.log(this.state.munSel);
        // console.log(this.state.brgySel);
        this.checkBlank(this.state.Fname, 'FNErr');
        this.checkBlank(this.state.Lname, 'LNErr');
        this.checkBlank(this.state.Gender, 'GenErr');
        this.checkBlank(this.state.userBdate, 'showDate');
        this.checkBlank(this.state.Email, 'EAErr');
        this.checkBlank(this.state.Number, 'NOErr');
        this.checkBlank(this.state.Pass, 'PSErr');
        this.checkBlank(this.state.Word, 'APErr');
        this.checkBlank(this.state.Addr, 'MuErr');
        this.checkBlank(this.state.utype, 'UTErr');
        if (!this.checkBlank(this.state.Email, 'EAErr')) {
            this.checkEmail(this.state.Email, 'EAErr')
        }
        if (!this.checkBlank(this.state.Number, 'NOErr')) {
            this.checkNum(this.state.Number, 'NOErr')
        }
        if (!this.checkBlank(this.state.Pass, 'PSErr')) {
            this.checkPass(this.state.Pass, 'PSErr', this.state.Word, 'APErr')
        }
        // console.log(this.state.Fname !== '', this.state.Lname !== '', this.state.Gender !== '', this.state.Email !== '', this.state.Number !== '', this.state.Pass !== '', this.state.Word !== '', this.state.munSel !== '', this.state.brgySel !== '', this.state.utype !== '', this.state.userBdate !== '', this.state.FNErr === false, this.state.LNErr === false, this.state.GenErr === false, this.state.EAErr === false, this.state.NOErr === false, this.state.PSErr === false, this.state.APErr === false, this.state.BrErr === false, this.state.UTErr === false);
        if (this.state.Fname !== '' && this.state.Lname !== '' && this.state.Gender !== '' && this.state.Email !== '' && this.state.Number !== '' && this.state.Pass !== '' && this.state.Word !== '' && this.state.munSel !== '' && this.state.brgySel !== '' && this.state.utype !== '' && this.state.userBdate !== '' && this.state.FNErr === false && this.state.LNErr === false && this.state.GenErr === false && this.state.EAErr === false && this.state.NOErr === false && this.state.PSErr === false && this.state.APErr === false && this.state.BrErr === false && this.state.UTErr === false) {
            this.setState({ progPos: true });
            // console.log(this.state.Fname, this.state.Mname, this.state.Lname, this.state.userBdate, this.state.Gender, this.state.Email, this.state.Number, this.state.Pass, this.state.munSel, this.state.brgySel, this.state.Addr1, this.state.utype, randomColor());
            createuser(this.state.Fname, this.state.Mname, this.state.Lname, this.state.userBdate, this.state.Gender, this.state.Email, this.state.Number, this.state.Pass, this.state.munSel, this.state.brgySel, this.state.Addr1, this.state.utype, randomColor());
        }
    }

    checkBlank(a, b) {
        var obj = {};
        if (a.replace(/\s/g, "").length <= 0) {
            obj[b] = true;
            this.setState(obj);
            return true;
        } else {
            obj[b] = false;
            this.setState(obj);
            return false;
        }
    }

    async checkEmail(a, b) {
        var reag = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
        var obj = {};
        if (!reag.test(a)) {
            obj[b] = true;
            this.setState(obj);
            this.setState({ Email: " ", errorIn: '', errorInfo: 'Email Address', errorsubs: 'is invalid' });
            return true;
        } else if (await this.checkExistEmail(a)) {
            obj[b] = true;
            this.setState(obj);
            this.setState({ Email: " ", errorIn: '', errorInfo: 'Email Address', errorsubs: 'is already use' });
            return true;
        } else {
            obj[b] = false;
            this.setState(obj);
            return false;
        }

    }

    checkNum(a, b) {
        var phoneno = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        var phoneno2 = /^\d{10}$/;
        var phoneno3 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{0})$/;
        var obj = {};
        if (!(a.match(phoneno) || a.match(phoneno2) || a.match(phoneno3))) {
            obj[b] = true;
            this.setState(obj);
            this.setState({ Number: "", errorIn: '', errorInfo: 'Contact Number', errorsubs: 'is invalid' });
            return true;
        } else {
            obj[b] = false;
            this.setState({ errorIn: 'Field with', errorInfo: '*', errorsubs: 'are required' });
            this.setState(obj);
            return false;
        }
    }
    async checkExistEmail(e) {
        const a = await firebase.collection('users').where("email", '==', e).get();
        if (a.empty) {
            return false;
        } else {
            return true;
        }
    }

    autoLoc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setCurrentPosition, positionError, {
                enableHighAccuracy: true,
            });

            function setCurrentPosition(position) {
                getReverseGeocodingData(position.coords.latitude, position.coords.longitude);
            }
            const getReverseGeocodingData = (lat, lng) => {
                var requestOptions = {
                    method: 'GET',
                };
                const apiKey = '3180dd98bdf6424383d1e28981882fb8';
                fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        this.setState({
                            Addr: result.features[0].properties.formatted,
                            munSel: result.features[0].properties.lat,
                            brgySel: result.features[0].properties.lon,
                        })
                    })
                    .catch(error => console.log('error', error));
            }
            function positionError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:

                        console.error("User denied the request for Geolocation.");
                        break;

                    case error.POSITION_UNAVAILABLE:

                        console.error("Location information is unavailable.");
                        break;

                    case error.TIMEOUT:

                        console.error("The request to get user location timed out.");
                        break;

                    case error.UNKNOWN_ERROR:

                        console.error("An unknown error occurred.");
                        break;
                    default:
                }
            }
        }
    }
    checkPass(a, b, c, d) {
        var obj1 = {};
        var obj2 = {};

        if (a !== c) {
            obj1[b] = true;
            obj2[d] = true;
            this.setState(obj1);
            this.setState(obj2);
            this.setState({ Word: '', Pass: '', errorIn: '', errorInfo: 'Passwords', errorsubs: 'do not match' });
            return true;
        } else {
            obj1[b] = false;
            obj2[d] = false;
            this.setState(obj1);
            this.setState(obj2);
            return false;
        }
    }


    render() {
        return (
            <>
                <div className="breadC">
                    <h1 className='logHead'>Sign Up</h1>
                </div>
                <div className='regDiv'>
                    <div className='regForm' autoComplete="off">
                        <h2 className='formHead hr'>User Information</h2>
                        <h6 className='subInfo'>{this.state.errorIn}<span>{this.state.errorInfo}</span>{this.state.errorsubs}</h6>
                        <div className='regForm-wrapper'>

                            <div className="field col3a">
                                <input type="text" name="regUserF" id="regUserF"
                                    className={this.state.FNErr ? 'login errorVal' : 'login'}
                                    placeholder=" " value={this.state.Fname}
                                    onChange={(e) => {
                                        var a = this.handleText(e.target.value);
                                        this.setState({ Fname: a })
                                    }}
                                    required />

                                <label id='LRFname'
                                    className={this.state.FNErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regUserF">
                                    First Name <span style={{ color: "red" }}>*</span>
                                </label>
                            </div>

                            <div className="field col3b">
                                <input type="text" name="regUserM" id="regUserM" className='login'
                                    placeholder=" " value={this.state.Mname}
                                    onChange={(e) => {
                                        var a = this.handleText(e.target.value);
                                        this.setState({ Mname: a })
                                    }} />
                                <label id='LRMname' className='label-log' htmlFor="regUserM">Middle Name </label>
                            </div>

                            <div className="field col3c">
                                <input type="text" name="regUserL" id="regUserL"
                                    className={this.state.LNErr ? 'login errorVal' : 'login'} value={this.state.Lname}
                                    placeholder=" "
                                    onChange={(e) => {
                                        var a = this.handleText(e.target.value);
                                        this.setState({ Lname: a })
                                    }} />
                                <label id='LRLname'
                                    className={this.state.LNErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regUserL">
                                    Last Name <span style={{ color: "red" }}>*</span>
                                </label>
                            </div>
                            <div className="field col2a">
                                <input
                                    id='regDates'
                                    name='regDates'
                                    type='date'
                                    required
                                    onFocus={() => { this.setState({ showDate: true }) }}
                                    onBlur={() => { !this.state.userBdate && this.setState({ showDate: false }) }}
                                    className={this.state.showDate || this.state.userBdate ? 'newDatePick2 sad' : 'newDatePick2'}
                                    placeholder="Birthdate:"
                                    onChange={(e) => { this.selDate(e) }} />
                                <label id='LRdate'
                                    className={this.state.showDate || this.state.userBdate ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regDates">Birth Date
                                    <span style={{ color: "red" }}>*</span></label>
                            </div>
                            <div className="field col2b">
                                <select id='regGend' name='regGend' onClick={() => { this.handlegend('gendPos') }} onBlur={(e) => { this.handleSlt(e, 'gendPos') }}
                                    className={(this.state.gendPos ? 'regSlt gendAct' : 'regSlt ' && this.state.GenErr ? 'regSlt errorVal' : 'regSlt ')}
                                    defaultValue='' onChange={(e) => { this.setState({ Gender: e.target.value }) }}>
                                    <option value='' disabled></option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                </select>
                                <label id='LRgend' className={this.state.GenErr || this.state.gendPos ? 'label-log gendMove' : 'label-log gend'} htmlFor="regGend">Gender<span style={{ color: "red" }}>*</span></label></div>

                            <div className="field col2a">
                                <input type="email" name="regEmail" id="regEmail" className={this.state.EAErr ? 'login errorVal' : 'login'}
                                    placeholder=" " value={this.state.Email} onBlur={(e) => { this.checkEmail(this.state.Email, 'EAErr') }}
                                    onChange={(e) => { this.setState({ Email: e.target.value }) }} />
                                <label id='LREmail'
                                    className={this.state.EAErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regEmail">Email Address <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2b">
                                <input type="tel" name="regCnum" id="regCnum"
                                    className={this.state.NOErr ? 'login errorVal' : 'login'}
                                    placeholder=" " value={this.state.Number}
                                    onChange={(e) => { this.setState({ Number: e.target.value }) }}
                                    required />
                                <label id='LRCon'
                                    className={this.state.NOErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regCnum">
                                    Contact Number <span style={{ color: "red" }}>*</span>
                                </label>
                            </div>

                            <div className="field col2a">
                                <input type="password" name="regPass" id="regPass" value={this.state.Pass}
                                    className={this.state.PSErr ? 'login errorVal' : 'login'} placeholder=" "
                                    onChange={(e) => { this.setState({ Pass: e.target.value }) }} />
                                <label id='LRPass'
                                    className={this.state.PSErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regPass">Password <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2b">
                                <input type="password" name="regCPass" id="regCPass" value={this.state.Word}
                                    className={this.state.APErr ? 'login errorVal' : 'login'} placeholder=" "
                                    onChange={(e) => { this.setState({ Word: e.target.value }) }} />
                                <label id='LRCPass'
                                    className={this.state.APErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regCPass">Confirm Password <span style={{ color: "red" }}>*</span></label>
                            </div>
                            {/* <div className="field col2a">
                                <select id='regMun' name='regMun'
                                    onClick={() => { this.handlegend('mun') }} onBlur={(e) => { this.handleSlt(e, 'mun') }}
                                    className={(this.state.munPos ? 'regSlt gendAct' : 'regSlt ' && this.state.MuErr ? 'regSlt errorVal' : 'regSlt ')}
                                    defaultValue='' onChange={(e) => { this.sltChange(e, 'muni') }} >
                                    <option value='' disabled> </option>
                                    {Municipality.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                </select>
                                <label id='LRmun'
                                    className={this.state.munPos || this.state.MuErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regMun">Municipality/City<span style={{ color: "red" }}>*</span></label>
                            </div>
                            <div className="field col2b">
                                <select id='regBrgy' name='regBrgy'
                                    onClick={() => { this.handlegend('brgy') }} onBlur={(e) => { this.handleSlt(e, 'brgy') }}
                                    className={(this.state.brgyPos ? 'regSlt gendAct' : 'regSlt ' && this.state.BrErr ? 'regSlt errorVal' : 'regSlt ')}
                                    defaultValue='' onChangeCapture={(e) => { this.setState({ brgySel: e.target.value }) }}>
                                    <option value='' hidden> </option>
                                    {this.state.munSel === 'Abucay' && brgyAbucay.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Bagac' && brgyBagac.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Balanga' && brgyBalanga.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Dinalupihan' && brgyDinalupihan.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Hermosa' && brgyHermosa.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Limay' && brgyLimay.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Mariveles' && brgyMariveles.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Morong' && brgyMorong.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Orani' && brgyOrani.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Orion' && brgyOrion.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Pilar' && brgyPilar.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.munSel === 'Samal' && brgySamal.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                </select>
                                <label id='LRbrgy'
                                    className={this.state.brgyPos || this.state.MuErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regBrgy">Barangay<span style={{ color: "red" }}>*</span></label>
                            </div> */}
                            {/* <div className="field col1 fixwed" >
                                <input type="text" required name="regAdd" id="regAdd" className={this.state.MuErr ? 'login errorVal' : 'login'}
                                    placeholder=" " readOnly value={this.state.Addr} onClick={() => { this.setState({ showMap: !this.state.showMap }) }}
                                    onChange={(e) => {
                                        var a = this.handleText(e.target.value);
                                        this.setState({ Addr: a })
                                    }} />
                                <label id='LRAdd'
                                    className={this.state.MuErr ? 'label-log gendMove' : 'label-log gend'} htmlFor="regAdd">Address<span style={{ color: "red" }}>*</span></label>
                                <div className='locat' onClick={() => { this.autoLoc(); }}><iC.FaMapMarkerAlt /></div>
                            </div> */}

                            <div className="field col1" >
                                <input type="text" required name="regAdd" id="regAdd" className={this.state.MuErr ? 'login errorVal' : 'login'}
                                    placeholder=" " value={this.state.Addr ? this.state.Addr : this.state.Addr1}
                                    onChange={(e) => {
                                        var a = this.handleText(e.target.value);
                                        this.setState({ Addr1: a });
                                        this.getSuggestions(e.target.value)
                                    }} />
                                <label id='LRAdd'
                                    className={this.state.MuErr ? 'label-log gendMove' : 'label-log gend'} htmlFor="regAdd">Address<span style={{ color: "red" }}>*</span></label>
                            </div>
                            {this.state.openSugg && this.state.suggestAddr && <ul className='suggestionDiv'>
                                {this.state.suggestAddr.map((d, i) => <li key={i} onClick={() => { this.setAddresa(d.properties) }}>
                                    {` • ${d.properties.formatted}`}
                                </li>)}
                            </ul>}
                            <div className='hr col1'>
                                {/* {this.state.showMap && <div className='mMapReg'><Map used='modifyReg' hideMap={() => { this.setState({ showMap: false }) }} /></div>} */}

                            </div>
                            <div style={{ marginTop: "-1.05vw" }} className="field col2a">
                                <select id='reguty' name='reguty'
                                    onClick={() => { this.handlegend('uty') }} onBlur={(e) => { this.handleSlt(e, 'uty') }}
                                    className={(this.state.utyPos ? 'regSlt gendAct' : 'regSlt ' && this.state.UTErr ? 'regSlt errorVal' : 'regSlt ')}
                                    defaultValue='' onChange={(e) => { this.sltChange(e, 'utype') }} >
                                    <option value='' disabled> </option>
                                    <option value='pet-owner'>Pet Owner</option>
                                    {!this.props.guest && <><option value='pet-breeder'>Pet Breeder</option>
                                        <option value='veterinarian'>Veterinarian</option></>}
                                </select>
                                <label id='LRmun'
                                    className={this.state.utyPos || this.state.UTErr ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regMun">Sign in as:<p style={{ color: "red" }}>*</p></label>
                            </div>

                            <div style={{ marginTop: "-1.05vw" }} className="col2b ignFix"><button onClick={() => { this.handleSign() }} className=' btn-log btnIDX'>Sign In</button></div>
                        </div>

                    </div>
                    {this.state.progPos && <Progressbar used='reg' start={1} end={100} />}
                </div>
                {/* {this.state.showMap && <div className='field_box mMapReg'>
                    <Map hideMap={() => { this.setState({ showMap: false }) }}
                        getData={(a) => {
                            this.setState({
                                Addr: a.features[0].properties.formatted,
                                munSel: a.features[0].properties.lat,
                                brgySel: a.features[0].properties.lon,
                            })
                        }}
                        used='modify'
                    />
                </div>} */}
            </>
        )
    }
}

export default UserRegForm