import React, { Component } from 'react'
import WelcomePage from '../components/WelcomePage'
import { checkCon, getDoc, getPets, offLinePet, offLineUser } from '../Functions/Functions';
import firebaseDb, { auth } from '../config/firebase'

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userData: [],
            pets: [],
        }
    }

    componentDidMount() {
        const res = checkCon();
        if (!res) {
            this.setState({
                userData: offLineUser,
                pets: offLinePet,
            })
        } else {
            this.interval = setInterval(() => {
                auth.onAuthStateChanged(user => {
                    getDoc(firebaseDb, user.uid).then(data => {
                        this.setState({ userData: data });
                    })
                    getPets(firebaseDb, user.uid).then(data => {
                        this.setState({ pets: data });
                    })
                })
            })
        }
    }
    render() {

        return (
            <>
                <WelcomePage UD={this.state.userData && this.state.userData} P={this.state.pets && this.state.pets} />
            </>
        )
    }
}

export default Welcome