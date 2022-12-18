import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import * as IC from 'react-icons/fa';
import './UserProfile.css'
import firebase, { auth } from "../config/firebase";
import './PetsAvatar.css'
import { SphericalUtil } from 'node-geometry-library';
import * as giICons from 'react-icons/gi';
import * as fcICons from 'react-icons/fc';
class PetsAvatar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            distance: 0,
            breedingAvail: false,
            showSnippet: false,
            likes: 0,
            rates: 0,
            totalRates: 0,
            raterNum: 0,
        }
    }


    getDistance(x1, y1, x2, y2) {
        if (!x1 || !x2 || !y1 || !y2) {
            return "No Data"
        } else {
            return SphericalUtil.computeDistanceBetween(
                { lat: x1, lng: y1 }, //from object {lat, lng}
                { lat: x2, lng: y2 } // to object {lat, lng}
            )
        }
    }
    async getDistanceUser(a, b) {
        const user = await firebase.doc(`users/${a}`).get();
        const user2 = await firebase.doc(`users/${b}`).get();
        if (a !== b && user.data().location && user2.data().location) {
            var distance = this.getDistance(user.data().location.lat, user.data().location.lng, user2.data().location.lat, user2.data().location.lng);
            if (distance !== "No Data") {
                distance = Math.round(100 * (distance / 1)) / 100;
                this.setState({ distance: distance });
            }
        }

    }

    getAge(a, b) {
        var dt1 = new Date(a);
        var diff = (b.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        diff = Math.abs(Math.ceil(1 * (diff)));
        var year = 365.25;
        var month = 31;
        var yearCount = 0;
        var monthCount = 0;
        if (diff > year) {
            while ((diff - year) > 0) {
                diff -= year;
                yearCount++;
                if (diff < year) {
                    while (diff > month) {
                        diff -= month;
                        monthCount++;
                    }
                }
            }
        } else {
            while (diff > month) {
                diff -= month;
                monthCount++;
                if (monthCount === 12) {
                    monthCount = 11;
                    console.log(monthCount);
                }
            }
        }
        this.setState({ y: yearCount, m: monthCount, age: yearCount + (monthCount * .01) })
    }
    getRates(a) {
        var ratess = 0;
        const refRates = firebase.collection(`Pets/${a}/rates`);
        refRates.onSnapshot(rates => {
            if (rates.empty) {
                this.setState({ rates: "Unrated" })
            } else {
                rates.docs.map(docs => {
                    ratess += docs.data().value;
                    return true;
                });
                this.setState({ rates: ratess / rates.size + " Rating" })
            }
        })
    }
    getLikes(a) {
        const refLike = firebase.collection(`Pets/${a}/likes`);
        refLike.onSnapshot(likes => {
            if (likes.size <= 1) {
                this.setState({ likes: likes.size + " Like" })
            } else {
                this.setState({
                    likes: likes.size + " Likes"
                })
            }
        })
    }
    checkAvailability() {
        if (this.props.myPet) {
            this.setState({ breedingAvail: true });
        } else {
            if ((this.state.age >= .06) && (this.props.pet.gender !== this.props.otherGender) && (this.state.distance > 0)) {
                this.setState({ breedingAvail: true });
            } else {
                this.setState({ breedingAvail: false });
            }
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            this.getDistanceUser(user.uid, this.props.pet.owner);
            this.interval = setInterval(() => {
                if (user) {
                    this.getAge(this.props.pet.bdate, new Date());
                    this.getLikes(this.props.pet.PetId);
                    this.getRates(this.props.pet.PetId);
                    this.checkAvailability();
                }
            })
        })
    }
    componentWillUnmount() {
        this.setState({
            distance: 0,
            breedingAvail: false,
            showSnippet: false,
            likes: 0,
            rates: 0,
            totalRates: 0,
            raterNum: 0,
        })
    }
    render() {
        return (<>
            {!this.props.pet.breeding && this.state.breedingAvail && <div
                className={this.props.selectedPet === this.props.pet.PetId ? "log-in breedAvatar selectedPet" : "log-in breedAvatar"}
                onMouseOut={() => { this.setState({ showSnippet: false }) }}
                onMouseOver={() => { this.setState({ showSnippet: true }) }}
                onClick={() => { this.props.setSelected(this.props.pet) }}>
                {this.props.pet.profile ? <img className='img' src={this.props.pet.profile} alt='dp' /> :
                    <div style={{
                        backgroundColor: this.props.pet.bgColor,
                    }} className='img' ><span className='txtInvert' >{this.props.pet.name && this.props.pet.name[0]}</span></div>}
                <span>
                    <span className='petAvatarName'><h1>{this.props.pet.name}</h1><h2>{this.props.pet.breed}</h2></span>
                    {/* <span className='petAvatarName'><h2>Breeding {this.state.breedingAvail ? 'true' : 'false'}</h2></span> */}
                    <div>
                        <IC.FaGgCircle className='petBadg' />
                        <IC.FaGgCircle className='petBadg' />
                        <IC.FaGgCircle className='petBadg' />
                        <IC.FaGgCircle className='petBadg' />
                        <IC.FaGgCircle className='petBadg' />
                        <IC.FaGgCircle className='petBadg' />
                    </div>
                </span>
                {this.props.pet.owner !== auth.currentUser.uid && <div className='distanceDiv'><giICons.GiPathDistance className='disIC' />{this.state.distance}m</div>}
                {(this.state.showSnippet || this.props.selectedPet === this.props.pet.PetId) &&
                    <div className='petSnippet'>
                        <div className='petSnippetProfile'>
                            {this.props.pet.profile ? <img className='snippetProf' title='View Profile' src={this.props.pet.profile} alt='dp' /> :
                                <div title='View Profile' style={{
                                    backgroundColor: this.props.pet.bgColor,
                                }} className='snippetProf' ><span className='txtInvert' >{this.props.pet.name && this.props.pet.name[0]}</span></div>}
                            <div className='snippetName'>
                                <span className='n1'>{this.props.pet.name}</span>
                                <span className='n2'>{this.props.pet.breed}{this.props.pet.gender !== 'Male' ? <giICons.GiFemale className='snippetGendF' /> : <giICons.GiMale className='snippetGendM' />}</span>
                                <span className='n3'>{this.state.y > 0 && this.state.y + ' year(s)'} {(this.state.y > 0 && this.state.m > 0) && '&'} {this.state.m > 0 && this.state.m + ' month(s)'}  {(this.state.y || this.state.m) && 'old'}</span>
                            </div>
                        </div>
                        <div className='snippetRates'>
                            <div>
                                <fcICons.FcLike className='snippR' />{this.state.likes}
                            </div>
                            <div >
                                <fcICons.FcRatings className='snippR' />{this.state.rates}
                            </div>
                        </div>
                        <div className='snippetHealth'>
                            <div>
                                <IC.FaGgCircle className='petBadg' />
                                <IC.FaGgCircle className='petBadg' />
                                <IC.FaGgCircle className='petBadg' />
                                <IC.FaGgCircle className='petBadg' />
                                <IC.FaGgCircle className='petBadg' />
                                <IC.FaGgCircle className='petBadg' />
                            </div>
                        </div>
                        <div className='snippBtns'>
                            <Link className='snip_Btn' title='View profile'
                                to={{ pathname: `/pets/${this.props.pet.PetId}`, state: { fromPetID: `${this.props.pet.PetId}` } }}>
                                <IC.FaPaw />
                            </Link>
                            <Link className='snip_Btn' title='View location'
                                to={{ pathname: `/locate`, state: { fromPetID: `${this.props.pet.PetId}` } }}>
                                <IC.FaMapMarkerAlt />
                            </Link>
                        </div>
                    </div>}
            </div >}
        </>
        )
    }
}

export default PetsAvatar


