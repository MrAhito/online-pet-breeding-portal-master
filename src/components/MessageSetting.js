import React, { Component } from 'react'
import './MessageSetting.css'
import { getDoc } from '../Functions/Functions'
import fireBaseDB, { auth } from "../config/firebase";

class MessageSetting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userDefault: [],
        }
    }
    async getActiveUSer() {
        const a = auth.currentUser.uid;
        if (this.props.messID) {
            const ref = await fireBaseDB.doc(`Messages/${this.props.messID}`).get();
            const b = ref.data();
            if (b.p1 === a) {
                const c = await getDoc(fireBaseDB, b.p2);
                this.setState({ userDefault: c, })
            }
            else if (b.p2 === a) {
                const c = await getDoc(fireBaseDB, b.p1);
                this.setState({ userDefault: c, })
            }
        }
        if (this.props.currentMessage && !this.props.newmEs) {
            const ref = await fireBaseDB.doc(`Messages/${this.props.currentMessage}`).get();
            const b = ref.data();
            if (b.p1 === a) {
                const c = await getDoc(fireBaseDB, b.p2);
                this.setState({ userDefault: c, })
            }
            else if (b.p2 === a) {
                const c = await getDoc(fireBaseDB, b.p1);
                this.setState({ userDefault: c, })
            }
        }

    }
    componentDidMount() {
        this.interval = setInterval(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.getActiveUSer();
                }
            })
        })
    }


    render() {
        return (
            <div className='msgSetting'>
                {this.state.userDefault && <>
                    {this.state.userDefault.profile ? <div className='dp-wrapper msgSetImg'><img className='adProp' src={this.state.userDefault.profile} alt='dp' /></div> : <div style={{ backgroundColor: this.state.userDefault.bgColor }} className='dp-wrapper msgSetImg' >{this.state.userDefault.first_name !== undefined && this.state.userDefault.first_name[0]}</div>}
                    <h3>{this.state.userDefault.first_name + ' '}{this.state.userDefault.middle_name && this.state.userDefault.middle_name[0] + ". " + this.state.userDefault.last_name}</h3>
                </>}
            </div>
        )
    }
}

export default MessageSetting
