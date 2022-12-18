import React, { Component } from 'react'
import { mMenudata } from '../data/NavData'
import './MessageBox.css'
// import * as IC1 from 'react-icons/fa'
import { getDoc } from '../Functions/Functions'
import fireBaseDB, { auth } from "../config/firebase";
import logo from '../images/icon.png'
import Inboxes from './Inboxes'

class MessageBox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            users: [],
            mess: [],
            messages: [],
            firstM: '',
            noMes: '',
            newM: false,
        }
        this.handleNew = this.handleNew.bind(this);
    }

    getTimestam(b) {
        var a = b.toLocaleTimeString();
        var currentDate = new Date();
        var c = '';

        if (currentDate.toLocaleDateString() !== b.toLocaleDateString()) {
            c = b.toString().split(' ')[0];
        }
        else {
            c =
                a.substring(0, (a.length - 6)) + ' ' +
                a.substring(a.length - 2);
        }
        return c;
    }

    handleNew() {
        this.props.newMes();
        if (this.props.selectedUserID) {
            this.props.selectedUser('');
        }
    }
    getFirstM(a) {
        this.setState({ firstM: a })
    }
    handlePref() {
        console.log("pref");
    }
    getUser() {
        getDoc(fireBaseDB, this.props.selectedUserID).then(doc => {
            this.setState({ users: doc })
        });
    }

    async getAllMEssages() {
        const mesRef = await fireBaseDB
            .collection(`users/${auth.currentUser.uid}/messages/`)
            .orderBy("timestamp", "desc")
            .get();

        if (!(mesRef.empty)) {
            this.setState({ messages: mesRef.docs })
        } else {
            this.setState({ messages: 'noMessage', noMes: 'noMessage' })
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    if (!this.props.currentMessage) {
                        this.getAllMEssages();
                        if (this.props.selectedUserID) {
                            this.getUser();
                        }
                    } else {
                        this.getAllMEssages();

                    }
                }
            })
        })
    }

    render() {
        return (
            <div className="messagebox">
                <div className='mTitle'>
                    <span>Messages</span>
                    <ul className='userBtns'>
                        {
                            mMenudata.map((item, index) => {
                                return (
                                    <li key={index} title={item.title} onClick={() => { item.title === 'Create Message' ? this.handleNew() : this.handlePref() }} ><a className={item.title === "Create Message" && this.state.newM ? 'useT' : 'useT on'} href={item.to}>{item.icon} <span className='optTitle'>{item.title}</span> </a></li>
                                )
                            })
                        }
                    </ul>
                    {/* <label className='mSear'>
                        <input type='text' placeholder='Search' className='msearchs' />
                        <div className='search-btn'><IC1.FaSearch /></div>
                    </label> */}
                </div>
                <ul className='msgUL'>
                    {this.props.newmEs && (this.props.selectedUserID ? <li className='msgLI msgHover'>
                        {this.state.users.profile ? <div className='dp-wrapper'><img className='adProp' src={this.state.users.profile} alt='dp' /></div> : <div style={{ backgroundColor: this.state.users.bgColor }} className='dp-wrapper' >{this.state.users.first_name !== undefined && this.state.users.first_name[0]}</div>}
                        <span className='chatName'>
                            <h1>New Message {this.state.users.first_name}</h1>
                        </span>
                    </li> : <li className='msgLI msgHover'>
                        <img alt='dp' className='chatHead' src={logo} />
                        <span className='chatName'>
                            <h1>New Message</h1>
                        </span>
                    </li>)
                    }
                    {this.state.noMes !== 'noMessage' || this.state.messages !== 'noMessage' ? (this.state.messages.map((item, index) => { return item.convos !== 0 && <Inboxes uses='dropdown' closeNewM={() => { this.props.newMes(false) }} drop={false} key={index} handleFirst={(a) => { this.getFirstM(a) }} currentMessage={this.props.currentMessage} value={item} /> }))
                        :
                        <li className='mNoMes'>
                            <span>No Message</span>
                        </li>
                    }
                    {/* {this.state.noMes !== 'noMessage' ? (this.state.messages.map((item, index) => { return <Inboxes activeF={this.props.user} key={index} handleFirst={(a) => { this.getFirstM(a) }} value={item} /> }))
                        :
                        <>{!this.props.newmEs &&
                            <li className='mNoMes'>
                                <span>No Message</span>
                            </li>}
                        </>
                    } */}
                </ul>
            </div>
        )
    }
}

export default MessageBox
