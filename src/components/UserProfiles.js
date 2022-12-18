import React, { Component } from 'react'
import './UserProfile.css'
import img2 from '../images/img1 (2).jpg';
import * as aIIC from 'react-icons/ai'
import './AddPost.css'
import AddPost from './AddPost';
import Post from './Post'
import firebaseDb, { auth } from "../config/firebase";
import * as IC from 'react-icons/fa';
import CameraDrop from './CameraDrop';
import { Link } from 'react-router-dom';
import ReportUser from './ReportUser';

class UserProfiles extends Component {
    constructor(props) {
        super(props)

        this.state = {
            post: [],
            pets: [],
            showCamDrop: false,
        }
    }
    getPost() {
        firebaseDb.collection("Post").where("postById", "==", `${this.props.UD.uid}`).where('deleted', '==', false).orderBy('timestamp', 'desc').onSnapshot((snaps) => {
            this.setState({ post: snaps.docs.map(doc => doc.data()) })
        }
        )
    }
    async getPets() {
        const pets = await firebaseDb.collection("Pets").where("owner", "==", `${this.props.UD.uid}`).get();
        this.setState({ pets: pets.docs.map(doc => doc.data()) })

    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.getPost();
            this.getPets();
        });

    }

    render() {
        return (
            <div className='UProf-wrapper'>
                <div className='tProp hr'>
                    <div className='covDiv'>
                        <img src={img2} alt='cover' className='covUser' />
                    </div>
                    <div className='dpUser'>
                        {this.props.UD.profile ? <img className='dpImg' src={this.props.UD.profile} alt='dp' /> :
                            <div style={{ backgroundColor: this.props.UD.bgColor, fontSize: "12vh" }} className='dpImg' >{this.props.UD.first_name && this.props.UD.first_name[0]}</div>}
                        {this.props.user && this.props.UD.uid === auth.currentUser.uid && <aIIC.AiFillCamera className='UAddIMG' onClick={() => { this.setState({ showCamDrop: true }) }} />}
                    </div>
                    <div className='UName'><span>{this.props.UD.first_name ? this.props.UD.first_name + ' ' + (this.props.UD.middle_name && this.props.UD.middle_name[0] + '. ') + this.props.UD.last_name : ' '}</span>
                        {this.props.UD.type ? this.props.UD.type : ' '}
                        {this.props.user && this.props.UD.uid !== auth.currentUser.uid && <div onClick={()=>{this.setState({report: true})}} className='reportA'>Report</div>}
                        </div>
                        {this.state.report && <ReportUser user={this.props.UD} closeCamDrop={() => { this.setState({ report: false })}}/>}
                    <CameraDrop user={this.props.UD} showCamDrop={this.state.showCamDrop} closeCamDrop={() => { this.setState({ showCamDrop: false }) }} />
                </div>
                <div className='bProp'>
                    <div className='Uleft'>
                        <h1 className='Ustle'>About</h1>
                        <div className='userInf hr'>
                            <span><IC.FaHome /><p>Lives in {this.props.UD.address && (this.props.UD.address + ', ')}{this.props.UD.baranggay && (this.props.UD.baranggay + ', ')}{this.props.UD.city && this.props.UD.city} </p></span>
                            <span><IC.FaClock /><p>{this.props.UD.timestamp ? 'Joined on ' + (this.props.UD.timestamp.toDate().toLocaleString()) : ' '}</p></span>
                            {this.props.user ? (this.props.UD.uid === auth.currentUser.uid
                                ? <span><IC.FaEllipsisH /><p>See your About Info</p></span>
                                : <span><IC.FaEllipsisH /><p>Know more About {this.props.UD.first_name}</p></span>)
                                :
                                <span><IC.FaEllipsisH /><p>Know more About {this.props.UD.first_name}</p></span>}
                        </div>
                        {this.props.UD.type !== 'veterinarian' && <> <h1 className='Ustle'>
                            {this.props.user ?
                                (this.props.UD.uid === auth.currentUser.uid ?
                                    'Your Pets'
                                    :
                                    `${this.props.UD.first_name}'s Pets`)
                                :
                                `${this.props.UD.first_name}'s Pets`
                            }</h1>

                            <div className='petInf hr'>
                                {this.state.pets && this.state.pets.map((p, i) => (
                                    <Link style={{ textDecoration: 'none' }} key={i} className='log-in'
                                        to={{ pathname: `/pets/${p.PetId}` }}
                                    >
                                        {p.profile ? <img className='pertA' src={p.profile} alt='dp' /> :
                                            <div style={{ backgroundColor: p.bgColor }} className='pertA' >{p.name && p.name[0]}</div>}
                                        <span>{p.name}
                                            <div>
                                                <IC.FaGgCircle className='petBadg' />
                                                <IC.FaGgCircle className='petBadg' />
                                                <IC.FaGgCircle className='petBadg' />
                                                <IC.FaGgCircle className='petBadg' />
                                                <IC.FaGgCircle className='petBadg' />
                                                <IC.FaGgCircle className='petBadg' />
                                            </div>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </>}
                    </div>
                    <div className='Uright'>
                        <h1 className='Ustle' style={{ width: "90%", marginBottom: "1vh" }}>Post</h1>
                        {this.props.user && this.props.UD.uid === auth.currentUser.uid && this.props.UD && <div className='addpost-warper'><AddPost UD={this.props.UD} /> </div>}
                        {this.state.post && <div className='post-warper'><Post user={this.props.user} post={this.state.post} /></div>}
                    </div>
                </div>
                <br />
                <br />
                <br />
            </div >
        )
    }
}

export default UserProfiles
