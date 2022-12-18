import React, { Component } from 'react'
import firebase, { auth } from '../config/firebase'
import Map from '../Maps/Map'

class SettingElement extends Component {
    constructor(props) {
        super(props)

        this.state = {
            addr: this.props.data.address,
            brgy: this.props.data.baranggay,
            city: this.props.data.city,
            email: this.props.data.email,
            contact: this.props.data.contact,
            birthday: this.props.data.birthday,
            cpass: '',
            npass: '',
            rpass: '',
            fname: this.props.data.first_name,
            mname: this.props.data.middle_name,
            lname: this.props.data.last_name,
            form: false,
        }
    }
    checkNum(a) {
        var phoneno = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        var phoneno2 = /^\d{10}$/;
        var phoneno3 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{0})$/;
        if (!(a.match(phoneno) || a.match(phoneno2) || a.match(phoneno3))) {
            return true;
        } else {
            return false;
        }
    }
    changedEmail(a) {
        var reag = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
        if (!reag.test(a)) {
            alert("Email format invalid");
        } else {
            auth.signInWithEmailAndPassword(this.props.data.email, this.props.data.password)
                .then((userCredential) => {
                    userCredential.user.updateEmail(a)
                        .then((data) => {
                            this.insertToDB(a, 'b');
                            alert(`${this.props.type} Changed`);
                            this.props.formS('');
                        })
                        .catch((err) => {
                            alert("Email already used");
                        })
                });
        }
    }

    insertToDB3(a, b, c, d) {
        const ref = firebase.doc(`users/${auth.currentUser.uid}`);
        const snaps = ref.get();
        if (!snaps.exist) {
            try {
                if (d === 'a') {
                    ref.set({ address: a, baranggay: b, city: c }, { merge: true });
                }
                if (d === 'b') {
                    ref.set({ first_name: c, middle_name: b, last_name: a }, { merge: true });
                }
            } catch (eee) { console.log(eee) }
        }
    }
    insertToDB(a, b) {
        const ref = firebase.doc(`users/${auth.currentUser.uid}`);
        const snaps = ref.get();
        if (!snaps.exist) {
            try {
                if (b === 'b') {
                    ref.set({ email: a }, { merge: true });
                }
                if (b === 'c') {
                    ref.set({ contact: a }, { merge: true });
                }
                if (b === 'd') {
                    ref.set({ birthday: a }, { merge: true });
                }
                if (b === 'e') {
                    ref.set({ password: a }, { merge: true });
                }
            } catch (eee) { console.log(eee) }
        }
    }
    changedData3(a, b, c, d, e, f, g) {
        if (a.replace(/\s/g, "").length <= 0
            || b.replace(/\s/g, "").length <= 0
            || c.replace(/\s/g, "").length <= 0) {
            alert("Fields * cannot be blank");
        } else if (a === d && b === e && c === f) {
            alert("No Modification found");
        }
        else {
            this.insertToDB3(c, b, a, g);
            return true;
        }
    }
    changedData(a, b, c) {
        if (c === 'd') {
            if (a.seconds === b.seconds) {
                console.log(a, b)
                alert("No Modification found");
            }
            else {
                this.insertToDB(new Date(a), c);
                return true;
            }
        } else {
            if (a.replace(/\s/g, "").length <= 0) {
                alert("Fields * cannot be blank");
            } else if (a === b) {
                alert("No Modification found");
            } else if ((c === 'c') && this.checkNum(a)) {
                alert("Wrong Format");
            } else if ((c === 'b')) {
                this.changedEmail(a)
            } else {
                alert("email valid");
                // this.insertToDB(a, c);
                // return true;
            }
        }
    }
    changedData2(a, b, c, d, e) {
        if (a.replace(/\s/g, "").length <= 0
            || b.replace(/\s/g, "").length <= 0
            || c.replace(/\s/g, "").length <= 0) {
            alert("Fields * cannot be blank");
        } else if (a !== d) {
            alert("Incorrect Current Password");
        } else if (b === d) {
            alert("You can't enter old password");
        }
        else if (b !== c) {
            alert("New passwords do no match");
        }
        else {
            auth.signInWithEmailAndPassword(this.props.data.email, this.props.data.password)
                .then((userCredential) => {
                    userCredential.user.updatePassword(b);
                });
            this.insertToDB(b, e);
            return true;
        }
    }
    handleSubmit() {
        var status = false;
        if (this.props.type === 'Address') {
            status = this.changedData3(this.state.city, this.state.brgy, this.state.addr, this.props.data.city, this.props.data.baranggay, this.props.data.address, 'a');
        } else if (this.props.type === 'Email Address') {
            status = this.changedData(this.state.email, this.props.data.email, 'b');
        } else if (this.props.type === 'Contact Number') {
            status = this.changedData(this.state.contact, this.props.data.contact, 'c');
        } else if (this.props.type === 'Birthdate') {
            status = this.changedData(this.state.birthday, this.props.data.birthday, 'd');
        } else if (this.props.type === 'Password') {
            status = this.changedData2(this.state.cpass, this.state.npass, this.state.rpass, this.props.data.password, 'e');
        } else if (this.props.type === 'Name') {
            status = this.changedData3(this.state.fname, this.state.mname, this.state.lname, this.props.data.first_name, this.props.data.middle_name, this.props.data.last_name, 'b');
        }
        if (status) {
            alert(`${this.props.type} Changed`);
            this.props.formS('');
        }
    }
    render() {
        return (
            <div className={this.props.type !== this.props.formSelected ? 'set-element' : 'setElement'}
                title={this.props.type}>
                <strong className='strong-set'>{this.props.type}</strong>
                {this.props.type !== this.props.formSelected
                    ? <span className='content'>{this.props.content}</span>
                    : <div className='content formChange'>
                        <strong className='strong-set'>Change {this.props.type}</strong>
                        {this.props.type === "Name" && <div className='field_box'>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>First:</strong>
                                <input onChange={(e) => { this.setState({ fname: e.target.value }) }}
                                    defaultValue={this.props.data.first_name}
                                    type='text' /></label>
                            <label className='field-wrapper-set'>
                                <strong>Middle:</strong>
                                <input onChange={(e) => { this.setState({ mname: e.target.value }) }}
                                    defaultValue={this.props.data.middle_name}
                                    type='text' /></label>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Last:</strong>
                                <input onChange={(e) => { this.setState({ lname: e.target.value }) }}
                                    defaultValue={this.props.data.last_name}
                                    type='text' /></label>
                        </div>}
                        {this.props.type === "Password" && <div className='field_box'>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Current:</strong>
                                <input
                                    onChange={(e) => { this.setState({ cpass: e.target.value }) }}
                                    type='text' /></label>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>New:</strong>
                                <input
                                    onChange={(e) => { this.setState({ npass: e.target.value }) }}
                                    type='text' /></label>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Re-type:</strong>
                                <input
                                    onChange={(e) => { this.setState({ rpass: e.target.value }) }}
                                    type='text' /></label>
                        </div>}
                        {this.props.type === "Birthdate" && <div className='field_box'>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Birthdate:</strong>
                                <input
                                    defaultValue={this.props.data.birthday.toDate()}
                                    onChange={(e) => { this.setState({ birthday: e.target.value }) }}
                                    type='date' /></label>
                        </div>}
                        {this.props.type === "Contact Number" && <div className='field_box'>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Contact Number:</strong>
                                <input style={{ width: '58%' }}
                                    defaultValue={this.props.data.contact}
                                    onChange={(e) => { this.setState({ contact: e.target.value }) }}
                                    type='tel' pattern="09xx-xxx-xxxx" /></label>
                        </div>}
                        {this.props.type === "Email Address" && <div className='field_box'>
                            <label className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Email Address:</strong>
                                <input style={{ width: '58%' }}
                                    defaultValue={this.props.data.email}
                                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                                    type='text' /></label>
                        </div>}
                        {/* {this.props.type === "Address" && <div className='field_box'>
                            <label style={{ width: '75%' }} className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Municipality/City:</strong>
                                <select style={{ width: '65%' }} onChange={(e) => { this.setState({ city: e.target.value, brgy: '' }) }}
                                    defaultValue={this.props.data.city}
                                >
                                    <option value='' disabled> </option>
                                    {Municipality.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                </select>
                            </label>

                            <label style={{ width: '75%' }} className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>Barangay:</strong>
                                <select style={{ width: '65%' }} onChange={(e) => { this.setState({ brgy: e.target.value }) }}
                                    value={this.state.brgy}
                                >
                                    <option value='' disabled></option>
                                    <option value={this.props.data.baranggay} disabled>{this.props.data.baranggay}</option>
                                    {this.state.city === 'Abucay' && brgyAbucay.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Bagac' && brgyBagac.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Balanga' && brgyBalanga.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Dinalupihan' && brgyDinalupihan.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Hermosa' && brgyHermosa.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Limay' && brgyLimay.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Mariveles' && brgyMariveles.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Morong' && brgyMorong.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Orani' && brgyOrani.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Orion' && brgyOrion.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Pilar' && brgyPilar.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                    {this.state.city === 'Samal' && brgySamal.map((item, index) => { return <option value={item.label} key={index}>{item.label}</option> })}
                                </select>
                            </label>
                            <label style={{ width: '75%' }} className='field-wrapper-set'>
                                <strong><span style={{ color: 'red' }}>*</span>House No./Street:</strong>
                                <input style={{ width: '65%' }} onChange={(e) => { this.setState({ addr: e.target.value }) }}
                                    defaultValue={this.props.data.address}
                                    type='text' /></label>
                        </div>} */}
                        {this.props.type === "Map Location" && <div style={{ height: "60vh" }} className='field_box'><Map closed={() => { this.props.formS('') }} used='modify' /></div>}

                        {this.props.type !== "Map Location" && <div className='field_box'>
                            <label className='field-wrapper-set btns'>
                                <button onClick={() => { this.props.formS('') }}>Cancel</button>
                                <button onClick={() => { this.handleSubmit() }} className='can' >Save</button>
                            </label>
                        </div>}
                    </div>}
                {
                    this.props.type !== this.props.formSelected && <span
                        onClick={() => { this.props.formS(this.props.type) }}
                        className='link'>
                        <span>Change</span>
                    </span>
                }
            </div >
        )
    }
}

export default SettingElement
