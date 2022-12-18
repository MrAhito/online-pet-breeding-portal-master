
import PostElement from "./PostElement";
import React, { Component } from 'react'

class Post extends Component {
    render() {
        return (
            <>
                {this.props.post.length > 0 ? this.props.post.map((item, index) => <PostElement user={this.props.user} value={this.props.post.length} key={index} posts={item} />) : <div className="NoPost">No post available</div>}
            </>
        )
    }
}


export default Post
