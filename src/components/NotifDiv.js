import React, { Component } from 'react'
import './NotifDiv.css'
import * as icons from 'react-icons/si';

class NotifDiv extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: true,
        }
    }

    componentDidMount() {
        const self = setInterval(() => {
            if (this.state.show) {
                this.setState({
                    show: false,
                })
            } else {
                clearInterval(self);
            }
        }, 2000);
    }
    render() {
        return (
            <div className="notification-container" id="notification-container">
                <div className={this.state.show ? "notification notification-success" : "notification notification-success hide"}>
                    <icons.SiCheckmarx className="notifIcon" />
                    <span>Post Created</span>
                </div>
            </div>
        )
    }
}

export default NotifDiv
