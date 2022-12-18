import React, { Component } from 'react'
import firebase, { auth } from "../config/firebase";
import { getDoc } from '../Functions/Functions';
import Feedback from './Feedback';

class TableDatas extends Component {
    constructor(props) {
        super(props)

        this.state = {
            owner_name: '',
            other_pet: '',
        }
    }

    async getDatas(a, b, c) {
        await getDoc(firebase, a).then(data => {
            if (!data.empty) {
                this.setState({ owner_name: data.first_name + " " + data.middle_name[0] + ". " + data.last_name, owner_id: data.uid });
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

    setView(a) {
        const ref = firebase.doc(`Breed/${a}`);
        try {
            ref.set({ status: 'viewed', timestamp: new Date(), viewedByReciever: true }, { merge: true });
        } catch (error) {
            console.log(error);
        }
    }

    accept() {
        const ref = firebase.doc(`Breed/${this.props.data.breedID}`);
        try {
            ref.set({ status: 'ongoing', timestamp: new Date() }, { merge: true });
        } catch (err) {
            console.log(err);
        }
    }

    decline() {
        const ref = firebase.doc(`Breed/${this.props.data.breedID}`);
        const pet1 = firebase.doc(`Pets/${this.state.pet_id}`);
        const pet2 = firebase.doc(`Pets/${this.state.other_id}`);
        try {
            pet1.set({ breeding: false }, { merge: true });
            pet2.set({ breeding: false }, { merge: true });
            ref.set({ status: 'declined', timestamp: new Date() }, { merge: true });
        } catch (err) {
            console.log(err);
        }
    }
    complete() {
        const ref = firebase.doc(`Breed/${this.props.data.breedID}`);
        const pet1 = firebase.doc(`Pets/${this.state.pet_id}`);
        const pet2 = firebase.doc(`Pets/${this.state.other_id}`);
        try {
            pet1.set({ breeding: false }, { merge: true });
            pet2.set({ breeding: false }, { merge: true });
            ref.set({ status: 'finished', timestamp: new Date() }, { merge: true });
        } catch (err) {
            console.log(err);
        }
    }
    cancel() {
        const ref = firebase.doc(`Breed/${this.props.data.breedID}`);
        const pet1 = firebase.doc(`Pets/${this.state.pet_id}`);
        const pet2 = firebase.doc(`Pets/${this.state.other_id}`);
        try {
            pet1.set({ breeding: false }, { merge: true });
            pet2.set({ breeding: false }, { merge: true });
            ref.set({ status: 'cancelled', timestamp: new Date() }, { merge: true });
        } catch (err) {
            console.log(err);
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.used === 'req') {
                this.getDatas(this.props.data.reciever, this.props.data.otherPet, this.props.data.myPet);
            } else if (this.props.used === 'pen' && this.props.data) {
                this.getDatas(this.props.data.sender, this.props.data.myPet, this.props.data.otherPet);
            }
            if (this.props.used === 'onh') {
                if (this.props.data.sender === auth.currentUser.uid) {
                    this.getDatas(this.props.data.reciever, this.props.data.myPet, this.props.data.otherPet);
                } else {
                    this.getDatas(this.props.data.sender, this.props.data.myPet, this.props.data.otherPet);
                }
            }
            if (this.props.used === 'dec') {
                if (this.props.data.sender === auth.currentUser.uid) {
                    this.getDatas(this.props.data.reciever, this.props.data.myPet, this.props.data.otherPet);
                } else {
                    this.getDatas(this.props.data.sender, this.props.data.myPet, this.props.data.otherPet);
                }
            }
            if (this.props.used === 'fin') {
                if (this.props.data.sender === auth.currentUser.uid) {
                    this.getDatas(this.props.data.reciever, this.props.data.myPet, this.props.data.otherPet);
                } else {
                    this.getDatas(this.props.data.sender, this.props.data.myPet, this.props.data.otherPet);
                }
            }
        });
        if (this.props.used === 'pen' && this.props.data) {
            this.setView(this.props.data.breedID);
        }
    }
    componentWillUnmount() {
        this.setState({ pet: null, other_pet: null })
    }
    render() {
        return (<>
            {this.state.pet && <tr>
                {this.state.pet.owner === auth.currentUser.uid ?
                    <td title='View Profile' className='th_2'><a href={`/pets/${this.state.pet.PetId}`}>{this.state.pet.name}</a></td>
                    :
                    <td title='View Profile' className='th_2'><a href={`/pets/${this.state.other_pet.PetId}`}>{this.state.other_pet.name}</a></td>
                }
                {this.state.pet.owner === auth.currentUser.uid ?
                    <td title='View Profile' className='th_2'><a href={`/pets/${this.state.other_pet.PetId}`}>{this.state.other_pet.name}</a></td>
                    :
                    <td title='View Profile' className='th_2'><a href={`/pets/${this.state.pet.PetId}`}>{this.state.pet.name}</a></td>
                }
                <td title='View Profile' className='th_2'><a href={`/profile/${this.state.owner_id}`}>{this.state.owner_name}</a></td>
                <td className='th_3'>{this.props.data.method}</td>
                <td className='th_3'>{this.props.data.status}</td>
                <td className='th_3'>{this.props.data.timestamp.toDate().toDateString()}</td>
                {this.props.used === 'req' && <td className='th_4'>
                    <div className='btn_containter'>
                        <button onClick={() => { this.cancel() }} className='tableData_btn dangerBtn'>Cancel</button>
                    </div>
                </td>}
                {this.props.used === 'pen' && <td className='th_4'>
                    <div className='btn_containter'>
                        <button onClick={() => { this.decline() }} className='tableData_btn dangerBtn'>Decline</button>
                        <button onClick={() => { this.accept() }} className='tableData_btn successBtn'>Accept</button>
                    </div>
                </td>}
                {this.props.used === 'onh' && <td className='th_4'>
                    <div className='btn_containter'>
                        <button onClick={() => { this.complete() }} className='tableData_btn successBtn'>Finish</button>
                    </div>
                </td>}
                {(this.props.used === 'fin') && <td className='th_4'>
                    <div className='btn_containter'>
                        <button onClick={() => { this.setState({ feedback: true }) }} className='tableData_btn successBtn'>Feedback</button>
                    </div>
                </td>}
            </tr>}
            {this.state.feedback && <Feedback fin={() => { this.complete() }} pet={this.state.pet.owner === auth.currentUser.uid ? this.state.other_pet : this.state.pet} hideFeed={() => { this.setState({ feedback: false }) }} />}
        </>
        )
    }
}

export default TableDatas
