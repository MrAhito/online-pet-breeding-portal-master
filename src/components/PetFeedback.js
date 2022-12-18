import React, { Component } from 'react'
import firebase, {
    // auth
} from "../config/firebase";
import PetFeedbackElement from './PetFeedbackElement';
import * as hiICons from 'react-icons/hi'

class PetFeedback extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rater: [],
        }
    }


    getRates(a) {
        const refRates = firebase.collection(`Pets/${a}/rates`);
        refRates.onSnapshot(rates => {
            this.setState({ rater: rates.docs.map(data => data.data()) });
        })
    }


    componentDidMount() {
        this.interval = setInterval(() => {
            this.getRates(this.props.pet_id);
        })
    }

    render() {
        return (
            <>
                {this.state.rater.length <= 0
                    ? <div className='pet-Pbot-col-Feed noFeed defa'><hiICons.HiAnnotation className='col-feed-ic' /> No feedback yet</div>
                    : this.state.rater.map((v, i) => <PetFeedbackElement data={v} key={i} />)
                }
            </>
        )
    }
}

export default PetFeedback
