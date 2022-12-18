import React, { Component } from 'react'
import * as siICons from 'react-icons/si'
import './Teams.css'
class Teams extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render() {
        return (
            <div className='teamWrapper'>
                {this.props.teamImg}
                <div className='teamInfo'>
                    <h1 className='teamName'>{this.props.teamName}</h1>
                    <h3 className='teamRole'>{this.props.teamRole}</h3>

                    <div className='socmed'>
                        {this.props.f && <a className='socs' title='Facebook' target="_blank" rel="noreferrer" href={this.props.f}> <siICons.SiFacebook /></a>}
                        {this.props.i && <a className='socs' title='Facebook' target="_blank" rel="noreferrer" href={this.props.i}> <siICons.SiInstagram /></a>}
                        {this.props.t && <a className='socs' title='Facebook' target="_blank" rel="noreferrer" href={this.props.t}> <siICons.SiTwitter /></a>}
                        {this.props.g && <a className='socs' title='Facebook' target="_blank" rel="noreferrer" href={this.props.g}> <siICons.SiGmail /></a>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Teams
