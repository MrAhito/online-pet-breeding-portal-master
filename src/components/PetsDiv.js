import React, { Component } from 'react'
import firebase, { auth } from '../config/firebase'
import * as Icons from 'react-icons/io5'
import './PetsDiv.css'
import PetProfile from './PetProfile'
import PetBubble from './PetBubble'
import PetAdd from './PetAdd'
import PetEdit from './PetEdit'

class PetsDiv extends Component {
    constructor(props) {
        super(props)
        this.state = {
            petData: [],
            petLikes: [],
            petRates: [],
            pets: [],
        }

    }

    getPets(id) {
        firebase.collection("Pets").where("owner", "==", id).onSnapshot(snapshot => {
            if (!snapshot.empty) {
                this.setState({ pets: snapshot.docs.map((pet) => pet.data()) })
                this.props.pet1(snapshot.docs[0].data());
            }
        })
    }
    handleSLt() {
        this.setState({ showForm: false, showFormEdit: false })
    }


    async getPetData(a) {
        const doc = await firebase.collection("Pets").where("PetId", "==", a).get();
        if (!doc.empty) {
            doc.docs.map((pet) => (this.setState({ petData: pet.data() })));
            if (this.props.user) {
                if (doc.docs[0].data().owner === auth.currentUser.uid) {
                    this.getPets(auth.currentUser.uid);
                } else {
                    this.getPets(doc.docs[0].data().owner);
                }
            }
        } else {
            if (this.props.user) {
                this.getPets(this.props.user);
            }
        }

    }

    async delPet(e) {
        await firebase.doc(`Pets/${e}`).delete();
        firebase.collection("Pets").where("owner", "==", auth.currentUser.uid).limit(1).onSnapshot(pets => {
            if (pets.empty) {
                window.location.href = `/pets`
            } else {
                window.location.href = `/pets/${pets.docs[0].data().PetId}`
            }
        })
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            const path = window.location.pathname;
            if (!(path.length <= 6)) {
                this.getPetData(path.substring(6, path.length));
            }
        })
    }

    render() {
        return (
            <>
                <div className="pet-wrapper">
                    <div className='pet-top-div'>
                        {this.state.petData.length === 0 ? <div className='pet-profile-none'>
                            No Pet Data
                        </div> : <PetProfile
                            editPet={() => { this.setState({ showFormEdit: true }) }}
                            user={this.props.user}
                            delPet={(e) => { this.delPet(e) }}
                            pet={this.state.petData}
                            rates={this.state.petRates}
                            likes={this.state.petLikes} />
                        }
                    </div>
                    {this.props.user && <div className="pet-bottom-div">
                        <div className='pet-bottom-wrapper'>
                            <div className='pet-bubble-div'>
                                {this.state.pets && this.state.pets.map((pet, index) => (<PetBubble
                                    selectedPet={this.state.petData.PetId}
                                    key={index}
                                    pet={pet} />))}
                            </div>
                        </div>
                        {(this.state.petData.owner === auth.currentUser.uid || !this.state.petData.owner) && <div className='pet-add' title='Add Pet'>
                            <div className='pet-bubble'>
                                <div onClick={() => { this.setState({ showForm: true }) }}
                                    className='pet-add-span'>
                                    <Icons.IoPawSharp className='pet-add-ic' />
                                    <span className='pet-add-text'>Add Pet</span>
                                </div>
                            </div>
                        </div>}
                    </div>}
                </div>
                {this.state.showFormEdit === true && <div className='showForm vlocker'>
                    <PetEdit data={this.state.petData} petProfile={true} handlSLt={() => { this.handleSLt() }} />
                </div>
                }
                {this.state.showForm === true && <div className='showForm vlocker'>
                    <PetAdd petProfile={true} handlSLt={() => { this.handleSLt() }} />
                </div>
                }
            </>
        )
    }
}

export default PetsDiv
