import React, { Component } from 'react'
import { getDoc } from '../Functions/Functions'
import firebase, {
    // auth
} from "../config/firebase";
import { Link } from 'react-router-dom';
import BeautyStars from 'beauty-stars';

class PetFeedbackElement extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rater: [],
        }
    }


    componentDidMount() {
        getDoc(firebase, this.props.data.rater).then((doc) => {
            this.setState({ rater: doc })
        })
    }
    render() {
        return (<>
            {this.state.rater && <div className='pet-Pbot-col-Feed defa'>
                <div className='pet-feed-header'>
                    <Link className='postImg'
                        to={{ pathname: `/profile/${this.state.rater.uid}`, state: { fromUserID: `${this.state.rater.uid}` } }
                        }>
                        {this.state.rater.profile !== undefined ? <div className='dp-wrapper'><img className='adProp' src={this.state.rater.profile} alt='dp' /></div> : <div style={{ backgroundColor: this.state.rater.bgColor }} className='dp-wrapper' >{this.state.rater.first_name !== undefined && this.state.rater.first_name[0]}</div>}

                        <p className='postName'>{this.state.rater.first_name + ' '}  {this.state.rater.middle_name !== undefined && !(this.state.rater.middle_name.replace(/\s/g, "").length <= 0) && this.state.rater.middle_name[0] + '. '} {this.state.rater.last_name}</p></Link>
                    <label className="rating-label">
                        <BeautyStars
                            inactiveColor="var(--borderColor)"
                            activeColor="var(--primaryTextColor)"
                            value={this.props.data.value}
                            size='4vh'
                            editable={false}
                        />
                        <div className='rate-value'>{this.props.data.value}</div>
                    </label>
                    <span className='rate-data'>
                        <b className='btopqoute'>“</b>
                        <i>{this.props.data.desc}</i>
                        <b className='bbotqoute'>”</b>
                    </span>
                </div>
            </div>}
        </>)
    }
}

export default PetFeedbackElement
