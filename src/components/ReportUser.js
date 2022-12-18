
import React, { Component } from 'react'
import * as bsIcons from 'react-icons/bi'
import './CameraDrop.css'
import './ReportUser.css'
import ShowWarning from './ShowWarning'
import fireBaseDB, { storage, auth } from "../config/firebase";

export class ReportUser extends Component {
    constructor(props) {
        super(props)
        this.picRef = React.createRef();
        this.state = {
            imgProfile: '',
            previewImg: '',
            imgToUp: '',
            showWarning: false,
        }
    }

    handleCam(a) {
        // if (a.label === 'Add') {
        //     // this.picRef.current.click();
        //     this.setState({ showAddDiv: true });
        // } else if (a.label === 'Remove') {
        //     if (this.props.pet) {
        //         fireBaseDB.doc("Pets/" + this.props.pet.PetId).set({ profile: '' }, { merge: true });
        //     } else if (this.props.user) {
        //         fireBaseDB.doc(`/users/${this.props.user.uid}`).set({ profile: '' }, { merge: true });
        //     } else { }
        //     this.props.closeCamDrop();

        // } else {
        //     this.props.closeCamDrop();
        // }
    }
    onImgChange(e) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({ previewImg: reader.result })
            }
        }
        reader.readAsDataURL(e.target.files[0]);
        this.setState({ imgToUp: e.target.files[0] });
    }

    resetIMG() {
        this.props.closeCamDrop();
        this.setState({ previewImg: '', imgToUp: '', showAddDiv: false, showWarning: false, showCamDrop: false });
    }

    async changeDP(a,b,c,d,e ) {
        console.log(a,b,c,d,e);
        const link = await this.fileUpload(a);
        // if (this.props.pet) {
            fireBaseDB.collection("Reports").add({
                    reportImg: link,
                    reporter: e,
                    reported: d,
                    desc: b,
                    violation: c,
                }).then(data =>{
                fireBaseDB.doc("Reports/" + data.id).set({ report_id: data.id }, { merge: true });
                    this.resetIMG();
                    this.props.closeCamDrop();
                });
        // } else if (this.props.user) {
        //     fireBaseDB.doc(`/users/${this.props.user.uid}`).set({ profile: link }, { merge: true });
        // } else {
        //     console.log("No data")
        // }

    }
    
    handlegend(a) {
        this.setState({ brgyPos: true });
    }
    handleSlt(e, a) {
        this.setState({ brgyPos: false });
    }
    async fileUpload(a) {
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
    }


    render() {
        return (
            <>
                    {/* <div className='camDropBlk' onClick={() => { this.props.closeCamDrop() }}></div>
                    <ul style={this.props.user && { margin: "46vh 0 0 16vh", }} className='pet-camera-drop'>
                        {cameraDrops && cameraDrops.map((cameraDrop, index) => <li className='camDropLI' onClick={() => { this.handleCam(cameraDrop); }} key={index}>{cameraDrop.icon}<span>{cameraDrop.label}</span></li>)}
                    </ul> */}
                    <div className='addProfileDiv ' >
                        <div className='add-profile-div heijsa' >
                            <h1 className='add-profile-header'>Report User</h1>
                            <div style={{ width: '100%' }} className='pet-div'></div>
                            <div className='pet-profile-imgDiv repoas'>
                                
                            <div className="field col1 fixwed" >
                                <input type="text" required name="regAdd" id="regAdd" className={this.state.MuErr ? 'login fixaf errorVal' : 'login fixaf'}
                                    placeholder=" " value={this.props.user.first_name +' '+ this.props.user.last_name}  readOnly />
                                <label id='LRAdd'
                                    className='label-log gendMove' htmlFor="regAdd">Name</label>
                            </div>
                            <div className="field col2b">
                                <select id='regBrgy' name='regBrgy'
                                    onClick={() => { this.handlegend('brgy') }} onBlur={(e) => { this.handleSlt(e, 'brgy') }}
                                    className={(this.state.brgySel ? 'regSlt gendAct' : 'regSlt ' && this.state.BrErr ? 'regSlt errorVal' : 'regSlt ')}
                                    defaultValue='' onChange={(e) => { this.setState({ brgySel: e.target.value }) }}>
                                    <option value='' hidden> </option>
                                    <option value='Pretending to Be Someone'>Pretending to Be Someone</option>
                                    <option value='Hateful Content'>Hateful Content</option>
                                    <option value='Fake Account'>Fake Account</option>
                                    <option value='Fake Name'>Fake Name</option>
                                    <option value='Malicious and Deceptive Practices'>Malicious and Deceptive Practices</option>
                                    <option value='Posting Inappropriate Things'>Posting Inappropriate Things</option>
                                    <option value='Harassment or Bullying'>Harassment or Bullying</option>
                                    <option value='Spam'>Spam</option>
                                </select>
                                <label id='LRbrgy'
                                    className={this.state.brgySel ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regBrgy">Violation</label>
                            </div>
                            <textarea onChange={(e) => { this.setState({ desc: e.target.value }) }} id='adInp' type='text' className='adInp' placeholder='Reason' ></textarea>

                                <div className='RegImgDiv'>
                                    <div className='RegImg_wrapper' onClick={(e) => { this.picRef.current.click(); }}>
                                        <input style={{ display: 'none' }} accept="image/*" type='file' onChange={(e) => { this.onImgChange(e) }} ref={this.picRef} />
                                        {this.state.previewImg !== '' ? <img className='prevImg' src={this.state.previewImg} alt='dp' />
                                            : <span>Add Image <bsIcons.BiImageAdd /></span>}
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '100%' }} className='pet-div'></div>
                            <div className='pet-profile-btnDiv'>
                                <button onClick={() => { this.changeDP(this.state.imgToUp, this.state.desc, this.state.brgySel, this.props.user.uid, auth.currentUser.uid) }}
                                    className={this.state.imgToUp && this.state.desc && this.state.brgySel ? 'add-profile-Btn add' : 'add-profile-Btn add off-btn'}
                                >Add</button>
                                <button onClick={() => { this.state.brgySel || this.state.imgToUp || this.state.desc ? this.setState({ showWarning: true }) : this.resetIMG() }} className='add-profile-Btn can'>Discard</button>
                            </div>
                        </div>
                        {this.state.showWarning === true && <ShowWarning titled='Discard Changes' parad='Are you sure you want to discard your changes?' cancel={() => { this.setState({ showWarning: false }) }} discard={() => { this.props.closeCamDrop(); this.resetIMG(); }} />}
                    </div>
            </>
        )
    }
}

export default ReportUser