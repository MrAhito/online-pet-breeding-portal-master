import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from "../config/firebase";
import { getDoc } from '../Functions/Functions';
import './NotificationDiv.css'

class NotificationDiv extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: 0,
        }
    }

    async getDatas(a, b, c) {
        await getDoc(firebase, a).then(data => {
            if (!data.empty) {
                this.setState({ owner_name: data });
            }
        })
        const doc = await firebase.doc(`Pets/${b}`).get();
        if (!doc.empty) {
            this.setState({ other_pet: doc.data() });
        }
        const doc2 = await firebase.doc(`Pets/${c}`).get();
        if (!doc2.empty) {
            this.setState({ pet: doc2.data() });
        }
    }
    async getBReedData() {
        const data = await firebase.doc(`Breed/${this.props.data.breedID}`).get();
        this.getDatas(data.data().sender, data.data().myPet, data.data().otherPet);
    }
    componentDidMount() {
        this.getBReedData();
    }
    render() {
        return (<>
            {(this.state.pet && this.state.other_pet && this.state.owner_name) &&
                <Link to='/breed' className={!this.props.data.viewedByReciever ? 'Notif_Li unviewed' : 'Notif_Li'}>
                    {this.state.owner_name.profile ?
                        <div className='dp-wrapper'>
                            <img className='adProp' src={this.state.owner_name.profile} alt='dp' />
                        </div> : <div style={{ backgroundColor: this.state.owner_name.bgColor }} className='dp-wrapper' >
                            {this.state.owner_name.first_name !== undefined && this.state.owner_name.first_name[0]}
                        </div>}
                    {this.props.data.title === 'Breed Request' && <p className='dataNotif'>
                        <strong>{this.state.owner_name.first_name} {this.state.owner_name.last_name}</strong> wants to breed {this.state.owner_name.gender && this.state.owner_name.gender === 'Male' ? 'his' : 'her'} {this.state.other_pet.breed} (<strong>{this.state.other_pet.name}</strong>) with your  {this.state.pet.breed} (<strong>{this.state.pet.name}</strong>)
                    </p>}
                    {this.props.data.title === 'Cancel Request' && <p className='dataNotif'>
                        <strong>{this.state.owner_name.first_name} {this.state.owner_name.last_name}</strong> cancel {this.state.owner_name.gender && this.state.owner_name.gender === 'Male' ? 'his' : 'her'} request to breed {this.state.owner_name.gender && this.state.owner_name.gender === 'Male' ? 'his' : 'her'} {this.state.other_pet.breed} (<strong>{this.state.other_pet.name}</strong>) with your  {this.state.pet.breed} (<strong>{this.state.pet.name}</strong>)
                    </p>}
                    {this.props.data.title === 'Declined Request' && <p className='dataNotif'>
                        <strong>{this.state.owner_name.first_name} {this.state.owner_name.last_name}</strong> declined your request to breed {this.state.owner_name.gender && this.state.owner_name.gender === 'Male' ? 'his' : 'her'} {this.state.pet.breed} (<strong>{this.state.pet.name}</strong>) with your  {this.state.other_pet.breed} (<strong>{this.state.other_pet.name}</strong>)
                    </p>}
                </Link>}
        </>)
    }
}

export default NotificationDiv
