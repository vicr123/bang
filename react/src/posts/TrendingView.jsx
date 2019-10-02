import React from 'react';
import Error from '../Error'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class TrendingView extends Error {
    constructor(props) {
        super(props);

        this.state = {
            currentPost: -1,
            currentMobileViewList: true
        }
    }
    
    onShowPost(post) {
        this.setState({
            currentPost: post.id,
            currentMobileViewList: false
        });
    }
    
    onReturnToPostList() {
        this.setState({
            currentMobileViewList: true
        });
    }

    
    render() {
        return <div className="trendingView scrollable">
            <PostList viewMobile={this.state.currentMobileViewList} onShowPost={this.onShowPost.bind(this)} endpoint={this.props.type} extraClassNames="postList" />
            <Post viewMobile={!this.state.currentMobileViewList} postId={this.state.currentPost} onReturnToPostList={this.onReturnToPostList.bind(this)}/>
        </div>
    }
}

export default TrendingView;