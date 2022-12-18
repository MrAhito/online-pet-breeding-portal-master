import React, { Component } from 'react'
import * as ioIcons from 'react-icons/io'
import './ViewDocs.css'

class ViewDocs extends Component {
    render() {
        return (
            <div className="view-doc-wrapper">
                <div className="view-content">
                    <div className="view-header">
                        {this.props.title}
                        <ioIcons.IoMdClose onClick={() => { this.props.closed() }} className="closeBtn" />
                    </div>
                    <div className="hr" style={{ width: '100%', marginBottom: '0vh' }}></div>
                    <object data={this.props.doc} type="application/pdf" width="100%" height="100%">
                        <p>Alternative text - include a link <a href={this.props.doc}>to the PDF!</a></p>
                    </object>
                </div>
            </div>
        )
    }
}

export default ViewDocs
