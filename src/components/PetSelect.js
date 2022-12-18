import React, { Component } from 'react'
import onClickOutside from "react-onclickoutside";
import * as  Icon1 from 'react-icons/ai';
import * as  Icon2 from 'react-icons/gi';
import './PetSelect.css'
import firebase, {
    auth
} from "../config/firebase";
import { SphericalUtil } from 'node-geometry-library';
var distance = [];

function getAge(a, b) {
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
            }
        }
    }
    return [{ y: yearCount, m: monthCount, age: yearCount + Math.round((monthCount / 12) * 10) / 10 }];
}

async function getLikes(a) {
    var data;
    const likes = await firebase.collection(`Pets/${a}/likes`).get();
    if (likes.empty) {
        data = 'N/A';
    } else {
        data = likes.size;
    }
    return data;
}


async function getRates(a) {
    var ratess = 0;
    const rates = await firebase.collection(`Pets/${a}/rates`).get();
    if (rates.empty) {
        ratess = 'N/A';
    } else {
        rates.docs.map(docs => {
            ratess += docs.data().value;
            return true;
        });
        ratess = ratess / rates.size;
    }
    return ratess;
}


function getDistance(x1, y1, x2, y2) {
    return SphericalUtil.computeDistanceBetween(
        { lat: x1, lng: y1 }, //from object {lat, lng}
        { lat: x2, lng: y2 } // to object {lat, lng}
    )
}
async function getDistanceUser(a, b) {
    const user = await firebase.doc(`users/${a}`).get();
    const user2 = await firebase.doc(`users/${b}`).get();
    if (user.data().location && user2.data().location) {
        var distance = getDistance(user.data().location.lat, user.data().location.lng, user2.data().location.lat, user2.data().location.lng);
        return distance = Math.round(distance);
    } else {
        return 'N/A';
    }

}

class PetSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            op: false,
        }
    }

    handleSelect(d) {
        getRates(d.PetId).then(d => {
            this.props.setRates(d);
        });
        if (auth.currentUser.uid !== d.owner) {
            getDistanceUser(auth.currentUser.uid, d.owner).then(data => {
                if (data === 1) {
                    data = '1 meter away';
                } else if (data > 1 && data <= 999) {
                    data = data + " meters away";
                } else if (data > 999) {
                    data = (data / 1000).toFixed(2) + ' km. away'
                }
                this.props.PetDistance(data);
            })
        }
        getLikes(d.PetId).then(d => {
            this.props.setLikes(d);
        });
        this.props.setAge(getAge(d.bdate, new Date())[0].age);
        this.props.setSelected(d);
        this.setState({ op: false })
        if (auth.currentUser.uid === d.owner) {
            this.props.resetOther();
        }
    }

    getMeter(a, b) {
        var sad;
        getDistanceUser(a, b).then(d => {
            sad = d;
        }).finally(() => {
            return sad;
        });
        console.log(sad)
    }
    handleClickOutside = evt => {
        this.setState({ op: false })
    };
    componentDidMount() {

    }
    render() {
        return (
            <div className='Select_Pet'>
                <div className='PetSelect_Div' onClick={() => { this.setState({ op: true }) }}>
                    {!this.props.selected ? 'No Pet Seleted' : <li className='Selecred'>
                        <strong>{this.props.selected.name}</strong>
                        ({this.props.selected.breed})
                        <span className='n2'>{this.props.selected.gender !== 'Male' ? <Icon2.GiFemale className='snippetGendF' /> : <Icon2.GiMale className='snippetGendM' />}</span>
                    </li>}
                    <Icon1.AiFillCaretDown className='carretDown' />
                </div>
                {this.state.op &&
                    <ul className='dataList'>
                        {this.props.data.map((d, i) => {
                            if (!distance[i]) {
                                getDistanceUser(auth.currentUser.uid, d.owner).then(data => {
                                    if (data > 1 && data < 999) {
                                        distance[i] = data + ' m. away'
                                    } else if (data > 999) {
                                        distance[i] = (data / 1000).toFixed(2) + ' km. away'
                                    }
                                });
                            }
                            return ((getAge(d.bdate, new Date())[0].age > .6 && getAge(d.bdate, new Date())[0].age < 20)
                                && ((this.props.gender && this.props.gender !== d.gender) || !this.props.gender)
                                && <li key={i}
                                    onClick={() => { this.handleSelect(d) }}>
                                    {d.profile ? <img className='img' src={d.profile} alt='dp' /> :
                                        <div style={{ backgroundColor: d.bgColor }} className='img' >{d.name && d.name[0]}</div>}
                                    <strong>{d.name}</strong>
                                    ({d.breed})
                                    <span className='n2'>{d.gender !== 'Male' ? <Icon2.GiFemale className='snippetGendF' /> : <Icon2.GiMale className='snippetGendM' />}</span>
                                    <span className='distreo'>{auth.currentUser.uid !== d.owner && distance[i]}</span>
                                </li>)
                        })}
                    </ul>
                }
            </div>
        )
    }
}

export default onClickOutside(PetSelect)
