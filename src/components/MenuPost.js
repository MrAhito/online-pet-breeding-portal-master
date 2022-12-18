import React, { Component } from 'react';
import onClickOutside from "react-onclickoutside";
import { AiOutlineEllipsis } from 'react-icons/ai';
import './MenuPost.css'; 
import { FaTrashAlt } from 'react-icons/fa';
import firebase
// { storage, auth }
 from "../config/firebase";
import ShowWarning from './ShowWarning'
import { VscReport } from 'react-icons/vsc';
import ReportUser from './ReportUser';
class MenuPost extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        warn:false,
         menud:false,
         report: false
      }
    }
    deletePost(){
        if(this.props.data && this.props.user){
            if(this.props.used === 'comment'){
                firebase.doc(`Post/${this.props.data.postId}/comments/${this.props.comment.id}` ).update({
                    deleted: true,
                }).then(d => {
                alert('Comment Deleted Successfully');
                }).catch(err=>{
                    console.log(err);
                alert('Error Deleting Comment');
                })

            }else{
                firebase.doc("Post/" + this.props.data.postId).update({
                    deleted: true,
                }).then(d => {
                alert('Post Deleted Successfully');
                }).catch(err=>{
                    console.log(err);
                alert('Error Deleting Post');
                })
            }
        }else{
        alert('Error Deleting Post');
        }
            // firebase.doc("Pets/" + this.props.pet.PetId).set({ profile: link }, { merge: true });
            this.setState({ warn: false })
            

    }
    handleClickOutside = evt => {
        this.setState({ menud: false })
    };
    componentDidMount(){
    }
  
  render() {
    return <div>
        <AiOutlineEllipsis className='postMenuIc' onClick={()=>{this.setState({menud:true})}}/>
        {this.state.menud && <div className='log-in menuDiv'>
        <ul className='admMenus'>

            {(this.props.user.type === 'admin' || this.props.user.uid === this.props.poster.uid) ? <>
                    <li onClick={()=>{this.setState({ warn: true, menud:false }) }}><FaTrashAlt className='menusIC' />Delete</li>
                    </>: 
                    <> 
                <li onClick={()=>{ this.setState({ report: true, menud:false  }) }}><VscReport className='menusIC' />Report</li>
                </>}
            </ul>

            </div>}
            {this.state.report && <ReportUser user={this.props.poster} closeCamDrop={() => { this.setState({ report: false })}}/>}
            
    {this.state.warn === true && <div className='warnind-wra'><ShowWarning titled={this.props.used === 'comment' ? 'Delete Comment' :'Delete Post'} parad={this.props.used === 'comment' ? 'Are you sure you want to delete this comment?' :'Are you sure you want to delete this post?'} cancel={() => { this.setState({ warn: false }) }} discard={() => { this.deletePost()}} /></div>}
    </div>;
  }
}

export default onClickOutside(MenuPost);
