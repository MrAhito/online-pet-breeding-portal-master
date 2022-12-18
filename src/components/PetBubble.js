import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class PetBubble extends Component {
    render() {
        return (
            <Link className={this.props.selectedPet === this.props.pet.PetId ? 'pet-bubble onsele' : 'pet-bubble'}
                to={{ pathname: `/pets/${this.props.pet.PetId}`, state: { fromPetID: `${this.props.pet.PetId}` } }}>
                {this.props.pet.profile
                    ? <img src={this.props.pet.profile}
                        alt='dp'
                        className='pet-bubble-img' />
                    : <div
                        className='pet-bubble-span' style={{ backgroundColor: this.props.pet.bgColor && this.props.pet.bgColor }}>
                        {this.props.pet.name && this.props.pet.name[0]}
                    </div>
                }
            </Link>
        )
    }
}

export default PetBubble
