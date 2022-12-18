import React, { Component } from 'react'
import firebase, { auth, storage } from "../config/firebase";
import './WelcomePage.css'
import img from '../images/welcomebg.svg'
import logo from '../images/icon.png'
import img2 from '../images/welcome.svg'
import * as ioIcons from 'react-icons/io'
import Progressbar from '../Functions/Progressbar'
import './Addpet.css'
import { createPet, randomColor } from '../Functions/Functions'
import PetAdd from './PetAdd'

class WelcomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            userType: '',
            showForm: false,
            gendPos: false,
            specPos: false,
            breedPos: false,
            furPos: false,
            eyePos: false,
            progPos: false,
            userBdate: '',
            petName: '',
            petGend: '',
            petSpec: '',
            petBreed: '',
            petFur: '',
            petEye: '',
            petDesc: '',
            file: '',
            pets: {},
            defPets: [
                { name: '', icon: { logo }, },
                { name: '', icon: { logo }, },
                { name: '', icon: { logo }, },
                { name: '', icon: { logo }, },
                { name: '', icon: { logo }, },
            ],
            errorIn: 'Field with',
            errorInfo: ' * ',
            errorsubs: 'are required:',
            locationData: '',
        }
        this.selDate = this.selDate.bind(this);

    }
    sltChange(e, a) {
        if (a === 'gend') {
            this.setState({
                petGend: e.target.value,
            })
        }
        if (a === 'spec') {
            this.setState({
                petSpec: e.target.value,
            })
        }
        if (a === 'breed') {
            this.setState({
                petBreed: e.target.value,
            })
        }
        if (a === 'fur') {
            this.setState({
                petFur: e.target.value,
            })
        }
        if (a === 'eye') {
            this.setState({
                petEye: e.target.value,
            })
        }
    }

    handlegend(a) {
        if (a === 'gend') {
            this.setState({ gendPos: true });
        } else if (a === 'spec') {
            this.setState({ specPos: true });
        } else if (a === 'breed') {
            this.setState({ breedPos: true });
        } else if (a === 'fur') {
            this.setState({ furPos: true });
        } else if (a === 'eye') {
            this.setState({ eyePos: true });
        }
    }
    handleSlt(e, a) {
        if (a === 'all') {
            this.setState({
                specPos: false,
                breedPos: false,
                gendPos: false,
                furPos: false,
                eyePos: false,
                petGend: '',
                petSpec: '',
                petBreed: '',
                petEye: '',
                petFur: ''
            });
        } else if (e.target.value === "" && a === 'gend') {
            this.setState({ gendPos: false });
        } else if (e.target.value === "" && a === 'spec') {
            this.setState({ specPos: false });
        } else if (e.target.value === "" && a === 'breed') {
            this.setState({ breedPos: false });
        } else if (e.target.value === "" && a === 'fur') {
            this.setState({ furPos: false });
        } else if (e.target.value === "" && a === 'eye') {
            this.setState({ eyePos: false });
        }
    }

    selDate(e) {
        this.setState({ userBdate: e.target.value, });

    }

    handleLogIn() {
        if (this.props.UD.type === 'pet-breeder' && this.props.P < 1) {
            alert('Please add at least 1 pet')
        } else if (this.props.UD.type === 'veterinarian') {
            if (!(this.state.file === '')) {
                alert('Make sure you send your Credentials, Please wait for admin feedback')
                window.location.href = '/'
            } else {
                alert('Please send your Credentials as Veterinarian')
            }
        } else {
            window.location.href = '/dashboard'
        }
    }

    handleSubmit() {
        if (this.state.userBdate === '') {
            this.setState({ errorInfo: 'Birthdate', errorsubs: 'is invalid' })

        } else {
            this.setState({ progPos: true });
            createPet(this.state.userBdate, this.state.petName, this.state.petGend, this.state.petSpec, this.state.petBreed, this.state.petFur, this.state.petEye, this.state.petDesc, randomColor(), "petStart");
        }
    }
    sendFile(a = this.state.file,) {
        const uids = auth.currentUser.uid;
        const UploadImg = storage.ref(`images/${uids}/${a.name}`).put(a);
        if (a !== '') {
            UploadImg.on(
                "state_changed",
                snapshot => {
                    if (snapshot.bytesTransferred === snapshot.totalBytes) {
                        const postRef = firebase.doc(`users/${uids}`);
                        try {
                            setTimeout(
                                () => {
                                    storage
                                        .ref(`images/${uids}/`)
                                        .child(a.name)
                                        .getDownloadURL()
                                        .then(url => {
                                            // emailjs.send('service_sb65ext', tempID, templateParams)
                                            //     .then(function (response) {
                                            postRef.set({ credentials: url, }, { merge: true }).then(d => {
                                                auth.signOut().then(() => {
                                                    auth.signOut().then(() => {
                                                        window.location.href = '/';
                                                    }).catch((error) => {
                                                        console.log(error.code + ': ' + error.message)
                                                    });
                                                }).catch((error) => {
                                                    console.log(error.code + ': ' + error.message)
                                                });
                                            })
                                        })
                                    // },
                                    // function (error) {
                                    //     console.log('FAILED...', error);
                                    // });
                                },
                                3000
                            );

                        } catch (error) {
                            console.log("Error in creating post", error);
                        }
                    }
                },
                error => {
                    console.log(error);
                }
            )
        }
    }

    // async fecthLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(location => {
    //             var requestOptions = {
    //                 method: 'GET',
    //             };
    //             const apiKey = '3180dd98bdf6424383d1e28981882fb8';
    //             fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&apiKey=${apiKey}`, requestOptions)
    //                 .then(response => response.json())
    //                 .then(result => {
    //                     const ref = firebase.doc(`users/${auth.currentUser.uid}`);
    //                     try {
    //                         ref.set({
    //                             location: {
    //                                 lat: location.coords.latitude,
    //                                 lng: location.coords.longitude,
    //                                 address: result.features[0].properties.formatted,
    //                                 timestamp: new Date(),
    //                             },
    //                         }, { merge: true });
    //                     } catch (err) { console.log(err) }
    //                 })
    //                 .catch(error => console.log('error', error));
    //         })
    //     }
    // }
    // componentDidMount() {
    //     this.interval = setInterval(() => {
    //         try {
    //             this.fecthLocation();
    //         } catch (err) { console.log(err) }
    //     }, 5000)
    // }
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(setCurrentPosition, positionError, {
    //         enableHighAccuracy: true,
    //     });
    //     function setCurrentPosition(position) {
    //         console.log(position.coords.longitude, position.coords.latitude);
    //         setCenter({
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude,
    //         });
    // setmarkLoc({
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    // })
    // getReverseGeocodingData(position.coords.latitude, position.coords.longitude);

    //     }
    //     function positionError(error) {

    //         switch (error.code) {
    //             case error.PERMISSION_DENIED:

    //                 console.error("User denied the request for Geolocation.");
    //                 break;

    //             case error.POSITION_UNAVAILABLE:

    //                 console.error("Location information is unavailable.");
    //                 break;

    //             case error.TIMEOUT:

    //                 console.error("The request to get user location timed out.");
    //                 break;

    //             case error.UNKNOWN_ERROR:

    //                 console.error("An unknown error occurred.");
    //                 break;
    //         }
    //     }
    // navigator.geolocation.getCurrentPosition(function async(position) {
    // console.log(position.coords.latitude)
    // setCenter({
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    // });
    // setmarkLoc({
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    // })
    // getReverseGeocodingData(position.coords.latitude, position.coords.longitude);
    // })
    // }
    // }

    render() {
        return (
            <div className='WelcomeWrap'>
                <img src={img} className='wcBG' alt='wcbg' />
                <img src={img2} className='wcTxt' alt='wctxt' />
                <h1>{this.props.UD.first_name && this.props.UD.first_name + ' '}{this.props.UD.middle_name && this.props.UD.middle_name[0] + '. '}{this.props.UD.last_name && this.props.UD.last_name}</h1>
                <h3>{this.props.UD.type}</h3>
                {this.state.showForm === false && !(this.state.file) && <button onClick={() => { this.handleLogIn() }} className='btn-log'>Home</button>}
                <h2>Help us make our community nice and fun</h2>
                {this.props.UD.type === 'pet-owner' && <>
                    <span>Add your Pets Information</span>
                    <div className='petREgDiv'>
                        {this.state.defPets.map((value, index) => {
                            return (
                                this.props.P[index] === '' || this.props.P[index] === undefined ?
                                    <div className='petBadge' key={index} onClick={() => { this.setState({ showForm: true }) }} >
                                        <ioIcons.IoMdPaw className='defICon' />
                                        <ioIcons.IoIosAdd className='defAICon' />
                                    </div>

                                    :
                                    <div className='petBadge' title={this.props.P[index].name} key={index}>
                                        <div style={{ backgroundColor: this.props.P[index].bgColor }} className='defICon'>{this.props.P[index] && this.props.P[index].name[0]}</div>
                                        <span>{this.props.P[index].name}</span>
                                    </div>)
                        })}
                    </div>
                </>}

                {(this.props.UD.type === 'pet-breeder') && <>
                    <span>Add your Pets Information</span>
                    <div className='petREgDiv'>

                        {this.state.defPets.map((value, index) => {
                            return (
                                this.props.P[index] === '' || this.props.P[index] === undefined ?
                                    <div className='petBadge' key={index} onClick={() => { this.setState({ showForm: true }) }} >
                                        <ioIcons.IoMdPaw className='defICon' />
                                        <ioIcons.IoIosAdd className='defAICon' />
                                    </div>
                                    :
                                    <div className='petBadge' title={this.props.P[index].name} key={index}>
                                        <div style={{ backgroundColor: this.props.P[index].bgColor }} className='defICon'>{this.props.P[index] && this.props.P[index].name[0]}</div>
                                        <span>{this.props.P[index].name}</span>
                                    </div>)
                        })}
                    </div>

                </>}

                {this.state.showForm === true && <div className='showForm'>
                    {/* <div className='hideForm' onClick={() => { this.setState({ showForm: false }); this.handleSlt('', 'all') }}><ioIcons.IoMdClose /></div> */}
                    <PetAdd petProfile={false} handlSLt={() => { this.setState({ showForm: false }); }} />
                </div>}

                {
                    this.props.UD.type === 'veterinarian' && <>
                        <span className='guestProlouge'>Send us your credentials to confirm if you are valid as veterinarian, Thank you.</span>
                        <input type='file' className='filer' name='fileCred' onChange={(e) => { this.setState({ file: e.target.files[0] }) }} />
                        {!(this.state.file === '') && <ioIcons.IoIosSend onClick={() => { this.sendFile() }} title='Send' className='sendFile' />}
                    </>
                }

                {this.state.progPos === true && <Progressbar start={0} />}


            </div >
        )
    }
}

export default WelcomePage
