import React, { Component } from 'react'
import './Post.css'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { BiComment } from 'react-icons/bi'
import fireBaseDB, { auth } from "../config/firebase";
import { getDoc } from '../Functions/Functions';
import { IoIosSend } from 'react-icons/io';
import DashboardHome from './DashboardHome';
import { Link } from 'react-router-dom';
import moment from 'moment';
import MenuPost from './MenuPost';

class PostElement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userID: '',
            posterData: [],
            liked: false,
            showCo: false,
            likes: '',
            postDesc:'',
            comment: '',
            comments: '',
            commentData: [],
            dateposted: '',
            status: 6,
        }
        this.getPostbyID = this.getPostbyID.bind(this);
    }

    async getPostbyID() {
        const ref = fireBaseDB.doc(`users/${this.props.posts.postById}`);
        const doc = await ref.get();
        try {
            if (doc.exists) {
                const datas = doc.data();
                this.setState({
                    posterData: datas,
                });
            }
        } catch (error) {
            console.error(error)
        }

    }
    getLikes() {
        const refLike = fireBaseDB.collection(`Post/${this.props.posts.postId}/likes`);
        auth.onAuthStateChanged(user => {
            if (user) {
                refLike.where("liker", "==", `${user.uid}`).onSnapshot((like) => {
                    try {
                        if (like.empty) {
                            this.setState({ liked: false });
                        } else {
                            this.setState({ liked: true });
                        }

                    } catch (error) { console.log(error) }
                })
            }
        })

        refLike.onSnapshot(likes => {
            this.setState({ likes: likes.size, liekers: likes.docs.map(data => data.data().likerName) })
        })

    }
    getComments() {
        const refComm = fireBaseDB.collection(`Post/${this.props.posts.postId}/comments`).where('deleted', '==', false).orderBy("timestamp", "desc");
        refComm.onSnapshot(commz => {
            this.setState({ comments: commz.size, commentData: commz.docs.map(doc => doc.data()) })
        })

    }

    async handleLike() {
        var name;
        const refLike = fireBaseDB.collection(`Post/${this.props.posts.postId}/likes`);
        const like = await refLike.where("liker", "==", `${auth.currentUser.uid}`).get();
        if (this.state.currentUser.type === 'admin') {
            const as = this.state.currentUser.name;
            name = as.charAt(0).toUpperCase() + as.slice(1);
        } else {
            name = this.state.currentUser.first_name + ' ' + (this.state.currentUser.middle_name && this.state.currentUser.middle_name[0] + '.') + ' ' + this.state.currentUser.last_name;
        }
        try {
            if (like.empty) {
                refLike.add({
                    likerName: name,
                    liker: auth.currentUser.uid,
                    timestamp: new Date(),
                }).then(data => {
                    fireBaseDB.doc(`Post/${this.props.posts.postId}/likes/${data.id}`).set({ id: data.id, }, { merge: true })
                })
            } else {
                fireBaseDB.doc(`Post/${this.props.posts.postId}/likes/${like.docs[0].id}`).delete();

            }
        } catch (err) { console.log(err) }
    }

    handleComment() {
        const refComm = fireBaseDB.collection(`Post/${this.props.posts.postId}/comments`);
        try {
            refComm.add({
                comment: this.state.comment,
                timestamp: new Date(),
                time: Date.now(),
                deleted:false,
                userID: auth.currentUser.uid,
            }).then(data => {
                fireBaseDB.doc(`Post/${this.props.posts.postId}/comments/${data.id}`).set({ id: data.id, }, { merge: true });
            }).finally(() => {
                this.setState({ comment: '' })
            })
        } catch (err) { console.log(err) }
    }

    async checkStatus() {
        const status = fireBaseDB.doc(`users/${this.props.posts.postById}`);
        const stats = await status.get();
        const stat = stats.data().isOnline;
        var isOnlineLast = (stat.toDate().getTime() - new Date().getTime()) / 1000;
        isOnlineLast /= 60;
        const time = Math.abs(Math.round(isOnlineLast));
        this.setState({
            status: time,
            dateposted: moment(this.props.posts.timestamp.toDate(), "YYYYMMDD").fromNow(),
        });
    }
    setName(a, b) {
        if (b === 0) {
            return a;
        } else {
            return '\n' + a;
        }
    }
    componentDidMount() {
        var Filter = require('bad-words'),
        filter = new Filter();
        this.interval = setInterval(() => {
            this.getPostbyID();
            this.getLikes();
            this.getComments();
            this.checkStatus();
            this.setState({postDesc : filter.clean(this.props.posts.desc) });
        this.setState({ userID: this.props.posts.postById });
        auth.onAuthStateChanged(user => {
            if (user) {
                getDoc(fireBaseDB, user.uid).then(data => {
                    this.setState({ currentUser: data });
                })
            }
        })
    });
}

    render() {
        return (
            <>
                {this.state.posterData.length !== 0 && <div id='postD' className='log-in'>
                    <input type='hidden' value={this.props.value} />
                    <div className='topPost'>
                        {(this.state.posterData.type === 'pet-owner' ||
                            this.state.posterData.type === 'pet-breeder' ||
                            this.state.posterData.type === 'veterinarian') && <Link className='postImg'
                                to={this.props.user
                                    ?
                                    (this.state.posterData.uid === auth.currentUser.uid
                                        ? { pathname: `/profile` }
                                        : { pathname: `/profile/${this.state.posterData.uid}`, state: { fromUserID: `${this.state.posterData.uid}` } })
                                    : { pathname: `/profile/${this.state.posterData.uid}` }
                                }>
                                {this.state.posterData.profile ? <div className='dp-wrapper'>
                                    <img className='adProp' src={this.state.posterData.profile} alt='dp' />
                                    {this.state.status <= 3 && <div className='isOnline'></div>}
                                </div> : <div style={{ backgroundColor: this.state.posterData.bgColor }} className='dp-wrapper' >
                                    {this.state.posterData.first_name !== undefined && this.state.posterData.first_name[0]}
                                    {this.state.status <= 3 && <div className='isOnline'></div>}
                                </div>}

                                <p className='postName'>{this.state.posterData.first_name + ' '}
                                    {this.state.posterData.middle_name && this.state.posterData.middle_name[0] + '. '}
                                    {this.state.posterData.last_name}  •
                                    {this.state.posterData.type === 'pet-breeder' && <span className='posterTyped petb'>{this.state.posterData.type}</span>}
                                    {this.state.posterData.type === 'veterinarian' && <span className='posterTyped vet'>{this.state.posterData.type}</span>}
                                    {this.state.posterData.type === 'pet-owner' && <span className='posterTyped peto'>{this.state.posterData.type}</span>}
                                </p>
                                created a post</Link>}
                        {this.state.posterData.type === 'admin' && <div className='postImg'>
                            {this.state.posterData.profile ? <div className='dp-wrapper'>
                                <img className='adProp' src={this.state.posterData.profile} alt='dp' />
                                {this.state.status <= 3 && <div className='isOnline'></div>}
                            </div> : <div style={{ backgroundColor: 'var(--primaryColor)', textTransform: "capitalize" }} className='dp-wrapper' >
                                {this.state.posterData.name !== undefined && this.state.posterData.name[0]}
                                {this.state.status <= 3 && <div className='isOnline'></div>}
                            </div>}

                            <p className='postName'> {this.state.posterData.name} •
                                <span className='posterTyped peta'>{this.state.posterData.type}</span>
                            </p>
                            created an announcement</div>}

                        <div className='enad' style={{ textTransform: "capitalize" }}>{this.state.dateposted}{this.state.currentUser && <MenuPost data={this.props.posts} user={this.state.currentUser} poster={this.state.posterData}/>}</div>
                        
                    </div>
                    <div className='postC'>
                        {(!this.props.posts.desc || (this.props.posts.desc && this.props.posts.desc.length < 1)) && <img src={this.props.posts.imgLink} alt='Capture' />}
                        {(!this.props.posts.imgLink || (this.props.posts.imgLink && this.props.posts.imgLink.length < 1)) && <span>{this.state.postDesc}</span>}
                        {(this.props.posts.imgLink && this.props.posts.desc) &&
                            <div className='fullPost'>
                                <span>{this.state.postDesc}</span>
                                <div className='imgSpan'>
                                    <img src={this.props.posts.imgLink} alt='Capture' />
                                </div>
                            </div>}

                    </div>
                    <div className='postat'>
                        {this.state.likes > 0 && <span style={{ cursor: "pointer" }} title={this.state.liekers
                            && this.state.liekers.map((d, i) => this.setName(d, i))}
                        ><span>{this.state.likes} </span>< AiOutlineLike className='statIC' /></span>}
                        {this.state.currentUser && this.state.comments > 0 && <span onClick={() => { this.setState({ showCo: !this.state.showCo }) }} className='comCView'>{this.state.showCo ? 'Hide ' : 'View '} {this.state.comments} {this.state.comments > 1 ? ' comments' : 'comment'}</span>}
                    </div>
                    {this.state.currentUser && this.state.posterData && this.state.posterData.type && <div className='postBtns'>
                        <button onClick={() => { this.handleLike() }} className={this.state.liked ? 'likeb on' : 'likeb'}>{this.state.liked ? <AiFillLike className='ptBtnIC on' /> : <AiOutlineLike className='ptBtnIC' />} Like</button>
                        <button onClick={() => { this.setState({ showCo: !this.state.showCo }) }} className='commb'><BiComment className='ptBtnIC' /> Comment</button>
                    </div>}

                    {this.state.currentUser && this.state.showCo && this.state.posterData && this.state.posterData.type && <> <div className='comment-f'>
                        <span className='postImg'>
                            <div className='isOnline'
                                style={{ margin: "2.5vh auto 0 30vh" }}></div>
                            {(this.state.currentUser && this.state.currentUser.type === 'admin')
                                ? <div style={{ textTransform: "capitalize", backgroundColor: 'var(--primaryColor)' }}
                                    className='dp-wrapper' >
                                    {this.state.currentUser.name && this.state.currentUser.name[0]}
                                </div>
                                : (this.state.currentUser.profile
                                    ? <div className='dp-wrapper' >
                                        <img className='adProp' src={this.state.currentUser.profile} alt='dp' />
                                    </div>
                                    : <div style={{ backgroundColor: this.state.currentUser.bgColor }}
                                        className='dp-wrapper' >
                                        {this.state.currentUser.first_name !== undefined && this.state.currentUser.first_name[0]}</div>)}
                        </span>
                        <input type='text' placeholder="Write something..." id='comment-input' name='comment-input' value={this.state.comment} onChange={(e) => { this.setState({ comment: e.target.value }) }} />
                        <IoIosSend className='sendComment' onClick={() => { this.handleComment() }} />
                    </div>
                        {this.state.commentData && this.state.commentData.map((item, index) => <DashboardHome value={item} key={index} posts={this.props.posts} currentUser={this.state.currentUser} posterData={this.state.posterData}/>)}
                    </>
                    }
                </div >
                }
            </>)
    }
}

export default PostElement
