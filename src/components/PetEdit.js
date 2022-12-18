import React, { Component } from 'react'
import './Addpet.css'
// import * as ioIcons from 'react-icons/io'
import { BreedDataCat, BreedDataDog, EyeColors, FurColors } from '../data/data'
// import { createPet, randomColor } from '../Functions/Functions'
import firebase from "../config/firebase";
import Progressbar from '../Functions/Progressbar'

class PetEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            userType: '',
            showForm: false,
            gendPos: true,
            specPos: true,
            breedPos: true,
            furPos: true,
            eyePos: true,
            progPos: false,
            userBdate: this.props.data.bdate,
            petName: this.props.data.name,
            petGend: this.props.data.gender,
            petSpec: this.props.data.species,
            petBreed: this.props.data.breed,
            petFur: this.props.data.furColor,
            petEye: this.props.data.eyeColor,
            petDesc: this.props.data.desc,
            pets: {},
            errorIn: 'Field with',
            errorInfo: ' * ',
            errorsubs: 'are required:',
        }
    }
    sltChange(e, a) {
        if (a === 'gend') {
            this.setState({
                petGend: e.target.value,
            })
        }
        if (a === 'spec') {
            this.setState({
                petSpec: e.target.value,
            })
        }
        if (a === 'breed') {
            this.setState({
                petBreed: e.target.value,
            })
        }
        if (a === 'fur') {
            this.setState({
                petFur: e.target.value,
            })
        }
        if (a === 'eye') {
            this.setState({
                petEye: e.target.value,
            })
        }

    }
    handleSlt(e, a) {
        if (a === 'all') {
            this.setState({
                specPos: false,
                breedPos: false,
                gendPos: false,
                furPos: false,
                eyePos: false,
                petGend: this.props.data.gender,
                petSpec: this.props.data.species,
                petBreed: this.props.data.breed,
                petEye: this.props.data.eyeColor,
                petFur: this.props.data.furColor,
            });
        } else if (e.target.value === "" && a === 'gend') {
            this.setState({ gendPos: false });
        } else if (e.target.value === "" && a === 'spec') {
            this.setState({ specPos: false });
        } else if (e.target.value === "" && a === 'breed') {
            this.setState({ breedPos: false });
        } else if (e.target.value === "" && a === 'fur') {
            this.setState({ furPos: false });
        } else if (e.target.value === "" && a === 'eye') {
            this.setState({ eyePos: false });
        }
    }
    handlegend(a) {
        if (a === 'gend') {
            this.setState({ gendPos: true });
        } else if (a === 'spec') {
            this.setState({ specPos: true });
        } else if (a === 'breed') {
            this.setState({ breedPos: true });
        } else if (a === 'fur') {
            this.setState({ furPos: true });
        } else if (a === 'eye') {
            this.setState({ eyePos: true });
        }
    }
    selDate(e) {
        this.setState({ userBdate: e.target.value, });

    }

    async closeForm() {
        if (this.props.petProfile) {
            return true;
        } else {
            this.setState({ progPos: true });
            this.props.handlSLt();
            return false;
        }
    }

    async handleSubmit() {

        // alert(this.state.userBdate + " \n" +
        //     this.state.petName + " \n" +
        //     this.state.petGend + " \n" +
        //     this.state.petSpec + " \n" +
        //     this.state.petBreed + " \n" +
        //     this.state.petFur + " \n" +
        //     this.state.petEye + " \n" +
        //     this.state.petDesc);
        this.setState({ progPos: true });
        const petRef = firebase.doc(`Pets/${this.props.data.PetId}`);
        try {
            petRef
                .update({
                    bdate: new Date(this.state.userBdate).toLocaleDateString(),
                    name: this.state.petName,
                    gender: this.state.petGend,
                    species: this.state.petSpec,
                    breed: this.state.petBreed,
                    furColor: this.state.petFur,
                    eyeColor: this.state.petEye,
                    desc: this.state.petDesc
                })
                .then(() => {
                    this.setState({ progPos: false });
                    this.props.handlSLt();
                })
        } catch (error) {
            console.log("Error in creating pet info", error);
        };
    }
    render() {
        return (
            <>
                {/* <div className='hideForm pet-add-close' onClick={() => { this.props.handlSLt() }}><ioIcons.IoMdClose /></div> */}

                <form className='petForm'>

                    <h2 className='formHead' style={{ textAlign: 'center', fontSize: '4vh' }}>Pet Information</h2>
                    <h6 style={{ marginBottom: "-3.5vh", }} className='subInfo'>{this.state.errorIn}<span>{this.state.errorInfo}</span>{this.state.errorsubs}</h6>

                    <div className='regForm-wrapper'>
                        <div className='col1 petAddDiv' >
                            <div className="field col2a">
                                <input type="text" name='pName' id='pName' onChange={(e) => { this.setState({ petName: e.target.value }) }} className='login' placeholder="Pet Name" defaultValue={this.state.petName} />
                                <label id='LRPName' className='label-log' htmlFor='pName'>Pet Name <span style={{ color: "red" }}>*</span></label>
                            </div>
                            <div className="field col2b">
                                <input
                                    id='regDates'
                                    name='regDates'
                                    required
                                    type='date'
                                    onFocus={() => { this.setState({ showDate: true }) }}
                                    onBlur={() => { !this.state.userBdate && this.setState({ showDate: false }) }} className={this.state.showDate || this.state.userBdate ? 'newDatePick2 sad' : 'newDatePick2'}
                                    defaultValue={new Date(this.state.userBdate).toISOString().substr(0, 10)}
                                    onChange={(e) => { this.selDate(e) }} />
                                <label id='LRdate'
                                    className={this.state.showDate || this.state.userBdate ? 'label-log gendMove' : 'label-log gend'}
                                    htmlFor="regDates">Birth Date
                                    <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2a">
                                <select id='regGend' name='regGend' onClick={() => { this.handlegend('gend') }} onBlur={(e) => { this.handleSlt(e, 'gend') }} className={this.state.gendPos ? 'regSlt gendAct' : 'regSlt '} defaultValue={this.state.petGend} onChange={(e) => { this.sltChange(e, 'gend') }} required>
                                    <option value='' hidden></option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                </select>
                                <label id='LRgend' className={this.state.gendPos ? 'label-log gendMove' : 'label-log gend'} htmlFor="regGend">Gender <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2b">
                                <select id='regFur' name='regFur' onClick={() => { this.handlegend('fur') }} onBlur={(e) => { this.handleSlt(e, 'fur') }} className={this.state.furPos ? 'regSlt gendAct' : 'regSlt '} defaultValue={this.state.petFur} onChange={(e) => { this.sltChange(e, 'fur') }} required>
                                    <option value='' disabled></option>
                                    {FurColors.map((item, index) => { return <option key={index} value={item.color}>{item.color}</option> })}
                                </select>
                                <div className='dotsa' style={{
                                    borderColor:
                                        (this.state.petFur === '' && '#3f3d56') ||
                                        (this.state.petFur === 'Black' && 'black') ||
                                        (this.state.petFur === 'Gray' && 'gray') ||
                                        (this.state.petFur === 'Brown' && 'brown') ||
                                        (this.state.petFur === 'Orange' && 'orange') ||
                                        (this.state.petFur === 'White' && 'black') ||
                                        (this.state.petFur === 'Dark Brown' && 'saddlebrown') ||
                                        (this.state.petFur === 'Light Brown' && 'sandybrown')
                                }}>
                                    {this.state.petFur === '' && <div style={{ backgroundColor: 'white' }}></div>}
                                    {this.state.petFur === 'Black' && <div style={{ backgroundColor: 'black' }}></div>}
                                    {this.state.petFur === 'White' && <div style={{ backgroundColor: 'white' }}></div>}
                                    {this.state.petFur === 'Brown' && <div style={{ backgroundColor: 'brown' }}></div>}
                                    {this.state.petFur === 'Gray' && <div style={{ backgroundColor: 'gray' }}></div>}
                                    {this.state.petFur === 'Orange' && <div style={{ backgroundColor: 'orange' }}></div>}
                                    {this.state.petFur === 'Dark Brown' && <div style={{ backgroundColor: 'saddlebrown' }}></div>}
                                    {this.state.petFur === 'Light Brown' && <div style={{ backgroundColor: 'sandybrown' }}></div>}
                                </div>
                                <label id='LRFur' className={this.state.furPos ? 'label-log gendMove' : 'label-log gend'} htmlFor="regFur">Fur Color <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2a">
                                <select id='pSpec' name='pSpec' onClick={() => { this.handlegend('spec') }} onBlur={(e) => { this.handleSlt(e, 'spec') }} className={this.state.specPos ? 'regSlt gendAct' : 'regSlt '} defaultValue={this.state.petSpec} onChange={(e) => { this.sltChange(e, 'spec') }} required>
                                    <option value='' disabled></option>
                                    <option value='Dog'>Dog</option>
                                    <option value='Cat'>Cat</option>
                                </select>
                                <label id='LRSpec' className={this.state.specPos ? 'label-log gendMove' : 'label-log gend'} htmlFor="pSpec">Species <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2b">
                                <select id='regEye' name='regEye' onClick={() => { this.handlegend('eye') }} onBlur={(e) => { this.handleSlt(e, 'eye') }} className={this.state.eyePos ? 'regSlt gendAct' : 'regSlt '} defaultValue={this.state.petEye} onChange={(e) => { this.sltChange(e, 'eye') }} required>
                                    <option value='' disabled></option>
                                    {EyeColors.map((item, index) => { return <option key={index} value={item.color}>{item.color}</option> })}
                                </select>
                                <div className='dotsa' style={{
                                    top: '17.75vh', borderColor:
                                        (this.state.petEye === '' && '#3f3d56') ||
                                        (this.state.petEye === 'Hazel/Brown' && 'sienna ') ||
                                        (this.state.petEye === 'Yellow/Orange' && 'orange') ||
                                        (this.state.petEye === 'Green' && 'olivedrab') ||
                                        (this.state.petEye === 'Blue' && 'dodgerblue') ||
                                        (this.state.petEye === 'Mixed Colors' && 'orange')
                                }}>
                                    {this.state.petEye === '' && <div style={{ backgroundColor: 'white' }}></div>}
                                    {this.state.petEye === 'Hazel/Brown' && <div style={{ backgroundColor: 'sienna' }}></div>}
                                    {this.state.petEye === 'Yellow/Orange' && <div style={{ backgroundColor: 'orange' }}></div>}
                                    {this.state.petEye === 'Blue' && <div style={{ backgroundColor: 'dodgerblue' }}></div>}
                                    {this.state.petEye === 'Green' && <div style={{ backgroundColor: 'olivedrab' }}></div>}
                                    {this.state.petEye === 'Mixed Colors' && <>
                                        <div style={{ backgroundColor: 'olivedrab' }}></div>
                                        <div style={{ backgroundColor: 'dodgerblue' }}></div>
                                    </>}
                                </div>
                                <label id='LRFur' className={this.state.eyePos ? 'label-log gendMove' : 'label-log gend'} htmlFor="regFur">Eye Color <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2a">
                                <select id='pBreed' name='pBreed' onClick={() => { this.handlegend('breed') }} onBlur={(e) => { this.handleSlt(e, 'breed') }} className={this.state.breedPos ? 'regSlt gendAct' : 'regSlt '} defaultValue={this.state.petBreed} onChange={(e) => { this.sltChange(e, 'breed') }} required>
                                    <option value='' disabled></option>
                                    {this.state.petSpec === 'Dog' && BreedDataDog.map((item, index) => { return <option key={index}>{item.value}</option> })}
                                    {this.state.petSpec === 'Cat' && BreedDataCat.map((item, index) => { return <option key={index}>{item.value}</option> })}
                                </select>
                                <label id='LRBreed' className={this.state.breedPos ? 'label-log gendMove' : 'label-log gend'} htmlFor="pBreed">Breed <span style={{ color: "red" }}>*</span></label>
                            </div>

                            <div className="field col2b">
                                <input type="text" name='pDesc' id='pDesc' defaultValue={this.state.petDesc} onChange={(e) => { this.setState({ petDesc: e.target.value }) }} className='login' />
                                <label id='LRPDesc' className='label-log' htmlFor='pDesc'>Descripion</label>
                            </div>
                        </div>
                    </div>
                    <div className='btnAddPEts'>
                        <button type={this.state.userBdate !== '' && this.state.petName !== '' && this.state.petGend !== '' && this.state.petFur !== '' && this.state.petBreed !== '' && this.state.petEye !== '' && this.state.petSpec !== '' ? 'button' : 'submit'} onClick={() => { this.state.userBdate !== '' && this.state.petName !== '' && this.state.petGend !== '' && this.state.petFur !== '' && this.state.petBreed !== '' && this.state.petEye !== '' && this.state.petSpec !== '' && this.handleSubmit(); }} className='btn btn-log'>Edit</button>
                        <button onClick={() => { this.props.handlSLt() }} className='btn btn-log cae'>Cancel</button>
                    </div>
                </form>
                {this.state.progPos === true && <Progressbar pet={true} start={0} />}
            </>
        )
    }
}

export default PetEdit
