import React from 'react';
import Error from '../Error'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class NewView extends Error {
    
    onShowPost(post) {
        console.log(post);
        //show post in Post section
        
    }
    
    render() {
        return <div className="trendingView scrollable">
            <PostList onShowPost={this.onShowPost.bind(this)} endpoint="new" extraClassNames="postList" />
            <Post />
        </div>
    }
}

export default NewView;