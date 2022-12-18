import React from 'react'
import PropTypes from 'prop-types'
import './ProgressBarDiv.css'
import Circle from '../images/480.gif'

const ProgressBarDiv = props => {
    const { value, data } = props;
    return <div className="progress-wrap">
        {props.used === 'reg' && <div className="progress-div" style={{ width: "100%" }}>
            <div style={{ width: `${value}%` }} className="progress" />
        </div>}
        <div className='CircleLoadDiv'>
            <div className={props.used === 'reg' ? 'regDIvProg' : ''}>
                <img src={Circle} alt='asd' />
                {props.used === 'reg' && <span>{data}</span>}
            </div>
        </div>
    </div>;
};
ProgressBarDiv.propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number,
    data: PropTypes.string
};
ProgressBarDiv.defaultProps = {
    max: 200
};
export default ProgressBarDiv
