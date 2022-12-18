import React, { Component } from 'react'
import { auth } from "../config/firebase";
import moment from 'moment';

class MessageBubble extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userDefault: [],
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(
                { userDefault: this.props.userDefault, }
            )
        })
    }
    // : ' '} • {moment(this.state.convos[0].timestamp.toDate(), "YYYYMMDD").fromNow()} </span>
    // 
    render() {
        return (
            <>
                {(this.props.convom && this.props.convom.sender === auth.currentUser.uid) ?
                    <div className='Msg reci'><div className='msgBubble recieve'>
                        {this.props.convom.data}
                    </div>
                        <span className='datefns'>{moment(this.props.convom.timestamp.toDate(), "YYYYMMDD").fromNow()}</span>
                    </div>
                    :
                    <div className='Msg send'>
                        {this.state.userDefault.profile ? <div className='dp-wrapper'>
                            <img className='adProp' src={this.state.userDefault.profile} alt='dp' />
                            <div>
                                {/* {this.props.staus < 3 && <div className='isOnline'></div>} */}
                            </div>
                        </div> : <div style={{ zoom: ".85", backgroundColor: this.state.userDefault.bgColor }} className='dp-wrapper' >
                            {this.state.userDefault.first_name !== undefined && this.state.userDefault.first_name[0]}
                            <div>
                                {/* {this.props.staus < 3 && <div className='isOnline'></div>} */}
                            </div>
                        </div>}
                        <div className='msgBubble sent'>{this.props.convom.data}
                        </div>
                        <span className='datefns'>{moment(this.props.convom.timestamp.toDate(), "YYYYMMDD").fromNow()}</span>
                    </div>}
            </>
        )
    }
}

export default MessageBubble
