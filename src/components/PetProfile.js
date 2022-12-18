import React, { Component } from 'react'
import { getDoc } from '../Functions/Functions';
import firebase, {
    auth, storage
} from "../config/firebase";
import * as fcICons from 'react-icons/fc'
import * as ioIcons from 'react-icons/io5'
import * as giICons from 'react-icons/gi'
import * as riIcons from 'react-icons/ri'
import * as aiICons from 'react-icons/ai'
import * as fiICons from 'react-icons/fi'
import * as vscICons from 'react-icons/vsc'
import './PetProfile.css'
import CameraDrop from './CameraDrop';
import Progressbar from '../Functions/Progressbar'
import ShowWarning from './ShowWarning'
import ViewDocs from './ViewDocs';
import PetFeedback from './PetFeedback';

class PetProfile extends Component {
    constructor(props) {
        super(props)
        this.vacRef = React.createRef();
        this.antRef = React.createRef();
        this.dewRef = React.createRef();
        this.cheRef = React.createRef();
        this.vitRef = React.createRef();
        this.state = {
            default: undefined,
            pet: [],
            liked: false,
            likes: 0,
            rates: 0,
            visitor: [],
            totalRates: 0,
            raterNum: 0,
            rateData: "loremLorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel porta sapien. Pellentesque viverra dui tincidunt, sollicitudin sapien nec, venenatis velit. Cras vulputate, lorem nec "
        }
    }
    async delPet() {
        this.setState({ progPos: true });
        this.props.delPet(this.props.pet.PetId);
    }
    getRates(a) {
        var ratess = 0;
        const refRates = firebase.collection(`Pets/${a}/rates`);
        refRates.onSnapshot(rates => {
            if (rates.empty) {
                this.setState({ rates: "Unrated", ratesx: "Feedback" })
            } else {
                rates.docs.map(docs => {
                    ratess += docs.data().value;
                    return true;
                });
                this.setState({ rates: ratess / rates.size + " Rating", ratesx: " Feedback (" + rates.size + ")" })
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
    isLiked(a, b) {
        const refLike = firebase.collection(`Pets/${a}/likes`);
        refLike.where("liker", "==", `${b}`).onSnapshot((like) => {
            try {
                if (like.empty) {
                    this.setState({ liked: false });
                } else {
                    this.setState({ liked: true });
                }

            } catch (error) { console.log(error) }
        })
    }
    async petBreedable(b, c) {
        const refBr = firebase.doc(`Pets/${c}`);
        const br = await refBr.get();
                if (!br.empty) {
                    if(br.data().breedable){
                    firebase.doc(`Pets/${c}`).set({ breedable: false, }, { merge: true })
                    }else{
                    firebase.doc(`Pets/${c}`).set({ breedable: true, }, { merge: true })
                    }
                    this.setState({ breedable: br.data().breedable});
            }
    }
    async petLike(b, c) {
        const refLike = firebase.collection(`Pets/${c}/likes`);
        const like = await refLike.where("liker", "==", `${b}`).get();
        try {
            if (like.empty) {
                refLike.add({
                    liker: b,
                    timestamp: new Date(),
                }).then(data => {
                    firebase.doc(`Pets/${c}/likes/${data.id}`).set({ id: data.id, }, { merge: true })
                })
            } else {
                firebase.doc(`Pets/${c}/likes/${like.docs[0].id}`).delete();
            }
        } catch (err) { console.log(err) }

    }
    async getVisitor(a) {
        getDoc(firebase, a).then((doc) => {
            this.setState({ visitor: doc })
        })
    }
    async getOwner(b){
        getDoc(firebase, b).then((doc) => {
            this.setState({ owner: doc })
        })
    }

    handleVerify(a, b, c, d, e) {
        const ref = firebase.doc(`Pets/${a}`);
        try {
            if (b === 'a') {
                ref.update({
                    vaccine: {
                        type: c,
                        doc: d,
                        confirmed: true,
                        verified: new Date(),
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been verified');
                })
            }
            if (b === 'b') {
                ref.update({
                    antirabbies: {
                        type: c,
                        doc: d,
                        confirmed: true,
                        verified: new Date(),
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been verified');
                })
            }
            if (b === 'c') {
                ref.update({
                    deworming: {
                        type: c,
                        doc: d,
                        confirmed: true,
                        verified: new Date(),
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been verified');
                })
            }
            if (b === 'd') {
                ref.update({
                    checkup: {
                        type: c,
                        doc: d,
                        confirmed: true,
                        verified: new Date(),
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been verified');
                })
            }
            if (b === 'e') {
                ref.update({
                    vitamins: {
                        type: c,
                        doc: d,
                        confirmed: true,
                        verified: new Date(),
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been verified');
                })
            }
        } catch (err) {
            console.log(err);
        }

    }
    handleUnverify(a, b, c, d, e) {
        const ref = firebase.doc(`Pets/${a}`);
        try {
            if (b === 'a') {
                ref.update({
                    vaccine: {
                        type: c,
                        doc: d,
                        confirmed: false,
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been unverified');
                })
            }

            if (b === 'b') {
                ref.update({
                    antirabbies: {
                        type: c,
                        doc: d,
                        confirmed: false,
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been unverified');
                })
            }

            if (b === 'c') {
                ref.update({
                    deworming: {
                        type: c,
                        doc: d,
                        confirmed: false,
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been unverified');
                })
            }

            if (b === 'd') {
                ref.update({
                    checkup: {
                        type: c,
                        doc: d,
                        confirmed: false,
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been unverified');
                })
            }

            if (b === 'e') {
                ref.update({
                    vitamins: {
                        type: c,
                        doc: d,
                        confirmed: false,
                        timestamp: e,
                    },
                }).then(da => {
                    alert('Records has been unverified');
                })
            }
        } catch (err) {
            console.log(err);
        }
    }


    async fileUpload(a) {
        if (a !== '') {
            const UploadImg = await storage.ref(`images/${auth.currentUser.uid}/${a.name}`).put(a);
            // console.log(UploadImg.totalBytes);
            if (UploadImg.totalBytes > 0) {
                const link = await storage
                    .ref(`images/${auth.currentUser.uid}/`)
                    .child(a.name)
                    .getDownloadURL()
                    .then(url => (url));
                return link;
            }
        } else {
            return '';
        }
    }
    async handleAddFile(a, b) {
        this.setState({ progPos: true });
        const file = await this.fileUpload(b.target.files[0]);
        const ref = firebase.doc(`Pets/${this.props.pet.PetId}`);
        if (a === "v") {
            ref.update({
                vaccine: {
                    type: this.props.pet.vaccine.type,
                    doc: file,
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Uploaded");
                this.setState({ progPos: false })
            })
        }
        else if (a === "a") {
            ref.update({
                antirabbies: {
                    type: this.props.pet.antirabbies.type,
                    doc: file,
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Uploaded");
                this.setState({ progPos: false })
            })
        }
        else if (a === "d") {
            ref.update({
                deworming: {
                    type: this.props.pet.deworming.type,
                    doc: file,
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Uploaded");
                this.setState({ progPos: false })
            })
        }
        else if (a === "c") {
            ref.update({
                checkup: {
                    type: this.props.pet.checkup.type,
                    doc: file,
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Uploaded");
                this.setState({ progPos: false })
            })
        }
        else if (a === "i") {
            ref.update({
                vitamins: {
                    type: this.props.pet.vitamins.type,
                    doc: file,
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Uploaded");
                this.setState({ progPos: false })
            })
        }
    }
    handleDelFile(a) {
        this.setState({ progPos: true });
        const ref = firebase.doc(`Pets/${this.props.pet.PetId}`);
        if (a === "v") {
            ref.update({
                vaccine: {
                    type: this.props.pet.vaccine.type,
                    doc: '',
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Deleted!")
                this.setState({ progPos: false })
            })
        }
        else if (a === "a") {
            ref.update({
                antirabbies: {
                    type: this.props.pet.antirabbies.type,
                    doc: '',
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Deleted!")
                this.setState({ progPos: false })
            })
        }
        else if (a === "d") {
            ref.update({
                deworming: {
                    type: this.props.pet.deworming.type,
                    doc: '',
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Deleted!")
                this.setState({ progPos: false })
            })
        }
        else if (a === "c") {
            ref.update({
                checkup: {
                    type: this.props.pet.checkup.type,
                    doc: '',
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Deleted!")
                this.setState({ progPos: false })
            })
        }
        else if (a === "i") {
            ref.update({
                vitamins: {
                    type: this.props.pet.vitamins.type,
                    doc: '',
                    confirmed: false,
                    timestamp: new Date(),
                },
            }).then(d => {
                alert("Document Deleted!")
                this.setState({ progPos: false })
            })
        }

    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.getLikes(this.props.pet.PetId);
            if (this.props.user) {
                this.isLiked(this.props.pet.PetId, this.props.user);
                this.getVisitor(this.props.user);
            }
            this.getOwner(this.props.pet.owner);
            this.getRates(this.props.pet.PetId);
        })
    }
    render() {
        return (
            <div className="pet-profile">
                {this.props.user && (this.props.pet.owner === auth.currentUser.uid && <div className="settingPet">
                    <fiICons.FiEdit title='Edit' className='petLikes-icon' onClick={() => { this.props.editPet() }} />
                    <riIcons.RiDeleteBin5Line title='Delete' className='petLikes-icon petred' onClick={() => { this.setState({ showWarning: true }) }} />
                </div>)}
                {this.state.showWarning && <ShowWarning
                    titled='Delete Pet'
                    parad='Are you sure you want to delete this pet profile?'
                    cancel={() => { this.setState({ showWarning: false }) }}
                    discard={() => { this.delPet() }} />}

                <div className='pet-profile-top'>
                    <div className='pet-profile-wrapper'>
                        {this.props.pet.profile
                            ? <img src={this.props.pet.profile}
                                alt='dp'
                                className='pet-profile-img' />
                            : <div
                                className='pet-profile-img' style={{ backgroundColor: this.props.pet.bgColor && this.props.pet.bgColor }}>
                                {this.props.pet.name && this.props.pet.name[0]}
                            </div>
                        }
                        <div className='pet-desc'>
                            <span className='pet-name name '>{this.props.pet.name}</span>
                            <span className='pet-name desc' >{this.props.pet.desc}</span>
                        </div>
                        {this.props.user && (this.props.pet.owner === auth.currentUser.uid && <aiICons.AiFillCamera className='pet-camera' onClick={() => { this.setState({ showCamDrop: true }) }} />)}
                        <CameraDrop pet={this.props.pet} showCamDrop={this.state.showCamDrop} closeCamDrop={() => { this.setState({ showCamDrop: false }) }} />
                    </div>
                    <div className='petLikes'>
                        {this.props.user ? (this.props.pet.owner === auth.currentUser.uid ? <div className='pet-likeDiv'>
                            <fcICons.FcCloseUpMode className='petLikes-icon' />  <span className='pet-likeSpan'>{this.state.likes}</span> </div> :
                            <div className='pet-likeDiv'>
                            <fcICons.FcCloseUpMode onClick={() => { this.petLike(auth.currentUser.uid, this.props.pet.PetId) }}
                                className={this.state.liked ? 'petLikes-icon' : 'petLikes-icon fades'} /> <span className='pet-likeSpan'>{this.state.likes}</span>
                        </div>) : <div className='pet-likeDiv'>
                            <fcICons.FcCloseUpMode className='petLikes-icon' />  <span className='pet-likeSpan'>{this.state.likes}</span> </div>}
                            <div className='pet-likeDiv'>
                        <fcICons.FcRatings className='petLikes-icon' />  <span className='pet-likeSpan'>{this.state.rates}</span> 
                        </div>
                        {this.state.visitor.type === 'veterinarian' ? (this.props.pet.breedable ? 
                         <div className='pet-likeDiv'>
                            <fcICons.FcLike onClick={() => { this.petBreedable(this.state.visitor.uid, this.props.pet.PetId) }}
                                className='petLikes-icon'/> <span className='pet-likeSpan'>Breedable</span> </div>: 
                                <div className='pet-likeDiv'>
                            <fcICons.FcLikePlaceholder onClick={() => { this.petBreedable(this.state.visitor.uid, this.props.pet.PetId) }}
                                className='petLikes-icon'/><span className='pet-likeSpan'>Unbreedable</span> </div>)
                            :
                            (this.props.pet.breedable ? 
                                <div className='pet-likeDiv'>
                                   <fcICons.FcLike className='petLikes-icon'/> <span className='pet-likeSpan'>Breedable</span> </div>: 
                                       <div className='pet-likeDiv'>
                                   <fcICons.FcLikePlaceholder className='petLikes-icon'/><span className='pet-likeSpan'>Unbreedable</span> </div>)
                            }
                    </div>

                </div>

                <div className='pet-div'></div>
                <div className='pet-div'></div>

                <div className='pet-profile-bottom'>
                    <div className='pet-Pbottom-col'>
                        <div className='pet-Pbot-col-header'>{this.state.ratesx}</div>
                        <div className='pet-div feedBack'>
                            <PetFeedback pet_id={this.props.pet.PetId} />
                        </div>
                    </div>

                    <div className='pet-Pbottom-col'>
                        <div className='pet-Pbot-col-header'>Pet Details</div>
                        <div className='pet-div'></div>
                        {this.state.visitor !== this.state.owner && <a href={this.state.owner && `/profile/${this.state.owner.uid}`} className='col-head-span' title='Owner'><giICons.GiRamProfile className='col-head-ic' /><span>· Owner ·</span>{this.state.owner && `${this.state.owner.first_name}  ${this.state.owner.last_name}`}</a>}
                        <span className='col-head-span' title='Birthdate'><giICons.GiPartyPopper className='col-head-ic' /><span>· Birthdate ·</span>{this.props.pet.bdate}</span>
                        <span className='col-head-span' title='Species'><ioIcons.IoPawSharp className='col-head-ic' /><span>· Gender ·</span>{this.props.pet.gender}</span>
                        <span className='col-head-span' title='Species'><ioIcons.IoPawSharp className='col-head-ic' /><span>· Species ·</span>{this.props.pet.species}</span>
                        <span className='col-head-span' title='Breed'><ioIcons.IoPawSharp className='col-head-ic' /><span>· Breed · </span>{this.props.pet.breed}</span>
                        <span className='col-head-span' title='Species'><ioIcons.IoPawSharp className='col-head-ic' /><span>· Fur Color ·</span>{this.props.pet.furColor}</span>
                        <span className='col-head-span' title='Species'><riIcons.RiEye2Line className='col-head-ic' /><span>· Eye Color · </span>{this.props.pet.eyeColor}</span>
                    </div>
                    <div className='pet-Pbottom-col'>
                        <div className='pet-Pbot-col-header'>Health Background</div>
                        <div className='pet-div'></div>
                        {this.props.pet.owner !== this.state.visitor.uid
                            && this.props.pet.vaccine.doc === ''
                            && this.props.pet.antirabbies.doc === ''
                            && this.props.pet.deworming.doc === ''
                            && this.props.pet.checkup.doc === ''
                            && this.props.pet.vitamins.doc === ''
                            && <div className='pet-Pbot-col-Feed noFeed defa'><ioIcons.IoDocumentAttach className='col-feed-ic' /> No Documents</div>}
                        {this.props.pet.vaccine.doc ?
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.vaccine.type ? this.props.pet.vaccine.type : 'Vaccine set'} ·</span>
                                {(this.state.visitor.type === 'veterinarian' || this.props.user === this.props.pet.owner) ? <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.vaccine.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.vaccine.type, viewDocs: true, linkDocs: this.props.pet.vaccine.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    {this.state.visitor.type === 'veterinarian' &&
                                        <>
                                            <button
                                                title='Verify'
                                                className={!this.props.pet.vaccine.confirmed ? 'vieDocs' : 'vieDocs  disabled veirifi'}
                                                onClick={() => { this.handleVerify(this.props.pet.PetId, 'a', this.props.pet.vaccine.type, this.props.pet.vaccine.doc, this.props.pet.vaccine.timestamp) }}
                                            ><vscICons.VscVerified /></button>
                                            <button
                                                title='Unverify'
                                                className={this.props.pet.vaccine.confirmed ? 'vieDocs unVerify' : 'vieDocs  disabled'}
                                                onClick={() => { this.handleUnverify(this.props.pet.PetId, 'a', this.props.pet.vaccine.type, this.props.pet.vaccine.doc, this.props.pet.vaccine.timestamp) }}>
                                                <vscICons.VscUnverified /></button>
                                        </>}

                                        {this.props.user === this.props.pet.owner && <>
                                        <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("v", e) }} ref={this.vacRef} />
                                        <button
                                            style={{ userSelect: "auto", pointerEvents: "auto" }}
                                            title={this.props.pet.vaccine.doc === '' ? 'Add Document' : 'Replace Document'}
                                            className='vieDocs' onClick={(e) => { this.vacRef.current.click() }} >
                                            {this.props.pet.vaccine.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                        </button>
                                        <button
                                            title='Remove Document'
                                            className={this.props.pet.vaccine.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                            onClick={() => { this.handleDelFile("v") }}>
                                            <vscICons.VscTrash /></button>
                                    </>}
                                </div> : 
                                 <div className='health-docs-btns'>
                                    <>
                                            {this.props.pet.vaccine.confirmed ? <button
                                                title='Verify'
                                                className='vieDocs veirifi'
                                            ><vscICons.VscVerified /></button>:
                                            <button
                                                title='Unverify'
                                                className='vieDocs wd'>
                                                <vscICons.VscUnverified /></button>}
                                        </>
                                 </div>
                                }
                            </span>
                            : this.props.user === this.props.pet.owner &&
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.vaccine.type ? this.props.pet.vaccine.type : 'Vaccine set'} ·</span>
                                <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className='vieDocs  disabled'
                                    ><vscICons.VscPreview /></button>
                                    <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("v", e) }} ref={this.vacRef} />
                                    <button
                                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                                        title={this.props.pet.vaccine.doc === '' ? 'Add Document' : 'Replace Document'}
                                        className='vieDocs' onClick={(e) => { this.vacRef.current.click() }} >
                                        {this.props.pet.vaccine.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                    </button>
                                    <button
                                        title='Remove Document'
                                        className='vieDocs  disabled'
                                    ><vscICons.VscTrash /></button>
                                </div>
                            </span>
                        }

                        {this.props.pet.antirabbies.doc ?
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.antirabbies.type && this.props.pet.antirabbies.type} ·</span>
                                {(this.state.visitor.type === 'veterinarian' || this.props.user === this.props.pet.owner) ? <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.antirabbies.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.antirabbies.type && this.props.pet.antirabbies.type, viewDocs: true, linkDocs: this.props.pet.antirabbies.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    {this.state.visitor.type === 'veterinarian' &&
                                        <>
                                            <button
                                                title='Verify'
                                                className={!this.props.pet.antirabbies.confirmed ? 'vieDocs' : 'vieDocs  disabled veirifi'}
                                                onClick={() => { this.handleVerify(this.props.pet.PetId, 'b', this.props.pet.antirabbies.type, this.props.pet.antirabbies.doc, this.props.pet.antirabbies.timestamp) }}
                                            ><vscICons.VscVerified /></button>
                                            <button
                                                title='Unverify'
                                                className={this.props.pet.antirabbies.confirmed ? 'vieDocs unVerify' : 'vieDocs  disabled'}
                                                onClick={() => { this.handleUnverify(this.props.pet.PetId, 'b', this.props.pet.antirabbies.type, this.props.pet.antirabbies.doc, this.props.pet.antirabbies.timestamp) }}>
                                                <vscICons.VscUnverified /></button>
                                        </>}
                                    {this.props.user === this.props.pet.owner && <>
                                        <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("a", e) }} ref={this.antRef} />
                                        <button
                                            style={{ userSelect: "auto", pointerEvents: "auto" }}
                                            title={this.props.pet.antirabbies.doc === '' ? 'Add Document' : 'Replace Document'}
                                            className='vieDocs' onClick={(e) => { this.antRef.current.click() }} >
                                            {this.props.pet.antirabbies.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                        </button>
                                        <button
                                            title='Remove Document'
                                            className={this.props.pet.antirabbies.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                            onClick={() => { this.handleDelFile("a") }}>
                                            <vscICons.VscTrash /></button>
                                    </>}
                                </div>
                                : 
                                <div className='health-docs-btns'>
                                   <>
                                           {this.props.pet.antirabbies.confirmed ? <button
                                               title='Verify'
                                               className='vieDocs veirifi'
                                           ><vscICons.VscVerified /></button>:
                                           <button
                                               title='Unverify'
                                               className='vieDocs wd'>
                                               <vscICons.VscUnverified /></button>}
                                       </>
                                </div>}
                            </span>
                            : this.props.user === this.props.pet.owner &&
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.antirabbies.type && this.props.pet.antirabbies.type} ·</span>
                                <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.antirabbies.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.antirabbies.type && this.props.pet.antirabbies.type, viewDocs: true, linkDocs: this.props.pet.antirabbies.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("a", e) }} ref={this.antRef} />
                                    <button
                                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                                        title={this.props.pet.antirabbies.doc === '' ? 'Add Document' : 'Replace Document'}
                                        className='vieDocs' onClick={(e) => { this.antRef.current.click() }} >
                                        {this.props.pet.antirabbies.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                    </button>
                                    <button
                                        title='Remove Document'
                                        onClick={() => { this.handleDelFile("a") }}
                                        className={this.props.pet.antirabbies.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                    ><vscICons.VscTrash /></button>
                                </div>
                            </span>
                        }

                        {this.props.pet.deworming.doc ?
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.deworming.type && this.props.pet.deworming.type} ·</span>
                                {(this.state.visitor.type === 'veterinarian' || this.props.user === this.props.pet.owner) ? <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.deworming.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.deworming.type && this.props.pet.deworming.type, viewDocs: true, linkDocs: this.props.pet.deworming.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    {this.state.visitor.type === 'veterinarian' &&
                                        <>
                                            <button
                                                title='Verify'
                                                className={!this.props.pet.deworming.confirmed ? 'vieDocs' : 'vieDocs  disabled veirifi'}
                                                onClick={() => { this.handleVerify(this.props.pet.PetId, 'c', this.props.pet.deworming.type, this.props.pet.deworming.doc, this.props.pet.deworming.timestamp) }}
                                            ><vscICons.VscVerified /></button>
                                            <button
                                                title='Unverify'
                                                className={this.props.pet.deworming.confirmed ? 'vieDocs unVerify' : 'vieDocs  disabled'}
                                                onClick={() => { this.handleUnverify(this.props.pet.PetId, 'c', this.props.pet.deworming.type, this.props.pet.deworming.doc, this.props.pet.deworming.timestamp) }}>
                                                <vscICons.VscUnverified /></button>
                                        </>}
                                    {this.props.user === this.props.pet.owner && <>
                                        <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("d", e) }} ref={this.dewRef} />
                                        <button
                                            style={{ userSelect: "auto", pointerEvents: "auto" }}
                                            title={this.props.pet.deworming.doc === '' ? 'Add Document' : 'Replace Document'}
                                            className='vieDocs' onClick={(e) => { this.dewRef.current.click() }} >
                                            {this.props.pet.deworming.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                        </button>
                                        <button
                                            title='Remove Document'
                                            className={this.props.pet.deworming.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                            onClick={() => { this.handleDelFile("d") }}>
                                            <vscICons.VscTrash /></button>
                                    </>}
                                </div>
                                : 
                                <div className='health-docs-btns'>
                                   <>
                                           {this.props.pet.deworming.confirmed ? <button
                                               title='Verify'
                                               className='vieDocs veirifi'
                                           ><vscICons.VscVerified /></button>:
                                           <button
                                               title='Unverify'
                                               className='vieDocs wd'>
                                               <vscICons.VscUnverified /></button>}
                                       </>
                                </div>}
                            </span>
                            : this.props.user === this.props.pet.owner &&
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.deworming.type && this.props.pet.deworming.type} ·</span>
                                <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.deworming.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.deworming.type && this.props.pet.deworming.type, viewDocs: true, linkDocs: this.props.pet.deworming.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("d", e) }} ref={this.dewRef} />
                                    <button
                                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                                        title={this.props.pet.deworming.doc === '' ? 'Add Document' : 'Replace Document'}
                                        className='vieDocs' onClick={(e) => { this.dewRef.current.click() }} >
                                        {this.props.pet.deworming.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                    </button>
                                    <button
                                        title='Remove Document'
                                        onClick={() => { this.handleDelFile("d") }}
                                        className={this.props.pet.deworming.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                    ><vscICons.VscTrash /></button>
                                </div>
                            </span>
                        }

                        {this.props.pet.checkup.doc ?
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.checkup.type && this.props.pet.checkup.type} ·</span>
                                {(this.state.visitor.type === 'veterinarian' || this.props.user === this.props.pet.owner) ? <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.checkup.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.checkup.type && this.props.pet.checkup.type, viewDocs: true, linkDocs: this.props.pet.checkup.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    {this.state.visitor.type === 'veterinarian' &&
                                        <>
                                            <button
                                                title='Verify'
                                                className={!this.props.pet.checkup.confirmed ? 'vieDocs' : 'vieDocs  disabled veirifi'}
                                                onClick={() => { this.handleVerify(this.props.pet.PetId, 'd', this.props.pet.checkup.type, this.props.pet.checkup.doc, this.props.pet.checkup.timestamp) }}
                                            ><vscICons.VscVerified /></button>
                                            <button
                                                title='Unverify'
                                                className={this.props.pet.checkup.confirmed ? 'vieDocs unVerify' : 'vieDocs  disabled'}
                                                onClick={() => { this.handleUnverify(this.props.pet.PetId, 'd', this.props.pet.checkup.type, this.props.pet.checkup.doc, this.props.pet.checkup.timestamp) }}>
                                                <vscICons.VscUnverified /></button>
                                        </>}
                                    {this.props.user === this.props.pet.owner && <>
                                        <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("c", e) }} ref={this.cheRef} />
                                        <button
                                            style={{ userSelect: "auto", pointerEvents: "auto" }}
                                            title={this.props.pet.checkup.doc === '' ? 'Add Document' : 'Replace Document'}
                                            className='vieDocs' onClick={(e) => { this.cheRef.current.click() }} >
                                            {this.props.pet.checkup.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                        </button>
                                        <button
                                            title='Remove Document'
                                            className={this.props.pet.checkup.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                            onClick={() => { this.handleDelFile("c") }}>
                                            <vscICons.VscTrash /></button>
                                    </>}
                                </div>
                                : 
                                <div className='health-docs-btns'>
                                   <>
                                           {this.props.pet.checkup.confirmed ? <button
                                               title='Verify'
                                               className='vieDocs veirifi'
                                           ><vscICons.VscVerified /></button>:
                                           <button
                                               title='Unverify'
                                               className='vieDocs wd'>
                                               <vscICons.VscUnverified /></button>}
                                       </>
                                </div>}
                            </span>
                            : this.props.user === this.props.pet.owner &&
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.checkup.type && this.props.pet.checkup.type} ·</span>
                                <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.checkup.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.checkup.type && this.props.pet.checkup.type, viewDocs: true, linkDocs: this.props.pet.checkup.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("c", e) }} ref={this.cheRef} />
                                    <button
                                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                                        title={this.props.pet.checkup.doc === '' ? 'Add Document' : 'Replace Document'}
                                        className='vieDocs' onClick={(e) => { this.cheRef.current.click() }} >
                                        {this.props.pet.checkup.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                    </button>
                                    <button
                                        title='Remove Document'
                                        onClick={() => { this.handleDelFile("c") }}
                                        className={this.props.pet.checkup.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                    ><vscICons.VscTrash /></button>
                                </div>
                            </span>
                        }
                        {this.props.pet.vitamins.doc ?
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.vitamins.type && this.props.pet.vitamins.type} ·</span>
                                {(this.state.visitor.type === 'veterinarian' || this.props.user === this.props.pet.owner) ? <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.vitamins.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.vitamins.type && this.props.pet.vitamins.type, viewDocs: true, linkDocs: this.props.pet.vitamins.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    {this.state.visitor.type === 'veterinarian' &&
                                        <>
                                            <button
                                                title='Verify'
                                                className={!this.props.pet.vitamins.confirmed ? 'vieDocs' : 'vieDocs  disabled veirifi'}
                                                onClick={() => { this.handleVerify(this.props.pet.PetId, 'e', this.props.pet.vitamins.type, this.props.pet.vitamins.doc, this.props.pet.vitamins.timestamp) }}
                                            ><vscICons.VscVerified /></button>
                                            <button
                                                title='Unverify'
                                                className={this.props.pet.vitamins.confirmed ? 'vieDocs unVerify' : 'vieDocs  disabled'}
                                                onClick={() => { this.handleUnverify(this.props.pet.PetId, 'e', this.props.pet.vitamins.type, this.props.pet.vitamins.doc, this.props.pet.vitamins.timestamp) }}>
                                                <vscICons.VscUnverified /></button>
                                        </>}
                                    {this.props.user === this.props.pet.owner && <>
                                        <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("i", e) }} ref={this.vitRef} />
                                        <button
                                            style={{ userSelect: "auto", pointerEvents: "auto" }}
                                            title={this.props.pet.vitamins.doc === '' ? 'Add Document' : 'Replace Document'}
                                            className='vieDocs' onClick={(e) => { this.vitRef.current.click() }} >
                                            {this.props.pet.vitamins.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                        </button>
                                        <button
                                            title='Remove Document'
                                            className={this.props.pet.vitamins.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                            onClick={() => { this.handleDelFile("i") }}>
                                            <vscICons.VscTrash /></button>
                                    </>}
                                </div>
                                : 
                                <div className='health-docs-btns'>
                                   <>
                                           {this.props.pet.vitamins.confirmed ? <button
                                               title='Verify'
                                               className='vieDocs veirifi'
                                           ><vscICons.VscVerified /></button>:
                                           <button
                                               title='Unverify'
                                               className='vieDocs wd'>
                                               <vscICons.VscUnverified /></button>}
                                       </>
                                </div>}
                            </span>
                            : this.props.user === this.props.pet.owner &&
                            <span
                                className='col-head-span healad'
                                title='Vaccine Type'>
                                <span className='headlType'><riIcons.RiSyringeFill className='col-head-ic med' />· {this.props.pet.vitamins.type && this.props.pet.vitamins.type} ·</span>
                                <div className='health-docs-btns'>
                                    <button
                                        title='View Document'
                                        className={this.props.pet.vitamins.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                        onClick={() => { this.setState({ docTitle: this.props.pet.vitamins.type && this.props.pet.vitamins.type, viewDocs: true, linkDocs: this.props.pet.vitamins.doc }) }}
                                    ><vscICons.VscPreview /></button>
                                    <input style={{ display: 'none' }} accept="application/pdf,application/vnd.ms-excel" type='file' onChange={(e) => { this.handleAddFile("i", e) }} ref={this.vitRef} />
                                    <button
                                        style={{ userSelect: "auto", pointerEvents: "auto" }}
                                        title={this.props.pet.vitamins.doc === '' ? 'Add Document' : 'Replace Document'}
                                        className='vieDocs' onClick={(e) => { this.vitRef.current.click() }} >
                                        {this.props.pet.vitamins.doc === '' ? <vscICons.VscNewFile /> : <vscICons.VscReplace />}
                                    </button>
                                    <button
                                        title='Remove Document'
                                        onClick={() => { this.handleDelFile("i") }}
                                        className={this.props.pet.vitamins.doc ? 'vieDocs' : 'vieDocs  disabled'}
                                    ><vscICons.VscTrash /></button>
                                </div>
                            </span>
                        }
                        {(!this.props.user && this.props.user !== this.state.visitor.uid && !this.props.pet.vaccine.doc && !this.props.pet.antirabbies.doc && !this.props.pet.deworming.doc && !this.props.pet.checkup.doc && !this.props.pet.vitamins.doc) && <span>No Record(s) Submitted</span>}
                    </div>
                </div>
                {this.state.viewDocs && this.state.linkDocs !== undefined && <ViewDocs title={this.state.docTitle} closed={() => { this.setState({ viewDocs: false }) }} doc={this.state.linkDocs} />}
                {this.state.progPos === true && <Progressbar pet={true} start={0} />}
            </div >
        )
    }
}

export default PetProfile