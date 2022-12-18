import React, { Component } from 'react'
import ConvoBox from './ConvoBox'
import MessageBox from './MessageBox'
// import MessageSetting from './MessageSetting'
import './MessagesDiv.css'
import { auth } from '../config/firebase'

class MessagesDiv extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mesID: '',
            selectedUser: '',
            mset: true,
            newM: false,
            currentMessage: '',
        }
        this.hidSet = this.hidSet.bind(this);
        this.newMes = this.newMes.bind(this);
    }

    hidSet() {
        this.setState({ mset: !this.state.mset })
    }
    setSelectedUser(a) {
        this.setState({
            selectedUser: a,
            mset: !this.state.mset
        })
    }
    newMes(a) {
        if (a === false) {
            this.setState({ newM: false })
        } else {
            this.setState({ newM: !this.state.newM })
        }
    }
    setMesID(e) {
        this.setState({ mesID: e })
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.setState({ currentMessage: this.props.user })
                }
            })
        })
    }

    render() {
        return (
            <div className='message-wrapper'>
                <div className='mbox-wrapper'>
                    <MessageBox currentMessage={this.state.currentMessage} newmEs={this.state.newM} newMes={(a) => { this.newMes(a) }} selectedUserID={this.state.selectedUser} selectedUser={(a) => { this.setSelectedUser(a) }} />
                </div>
                {(this.props.user || this.state.newM) &&
                    <div className='convo-wrapper'>
                        <ConvoBox messID={this.state.mesID} currentMessage={this.state.currentMessage} setMesID={(e) => { this.setMesID(e) }} newmEs={this.state.newM} newMes={(a) => { this.newMes(a) }} selectedUserID={this.state.selectedUser} selectedUser={(a) => { this.setSelectedUser(a) }} hidSet={() => { this.hidSet() }} />
                    </div>}
                {/* {(!this.state.mset) && (this.state.currentMessage || this.state.mesID) && <div className='mset-wrapper'>
                    <MessageSetting currentMessage={this.state.currentMessage} messID={this.state.mesID} newmEs={this.state.newM} />
                </div>} */}

            </div>
        )
    }
}

export default MessagesDiv
