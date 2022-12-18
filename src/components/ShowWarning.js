import React, { Component } from 'react'
import './ShowWarning.css'

class ShowWarning extends Component {
    render() {
        return (
            <div className="warning-wraper">
                <div className="warning-div">
                    <h1>{this.props.titled}</h1>
                    <div style={{ width: '100%' }} className='pet-div'></div>
                    <h3>{this.props.parad}</h3>
                    <div style={{ width: '100%' }} className='pet-div'></div>
                    <div className='pet-profile-btnDiv'>
                        <button className='add-profile-Btn add' onClick={() => { this.props.cancel() }}>No</button>
                        <button onClick={() => { this.props.discard() }} className='add-profile-Btn can'>Yes</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowWarning
