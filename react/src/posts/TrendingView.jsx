import React from 'react';
import Error from '../Error'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class TrendingView extends Error {
    onShowPost(post) {
        console.log(post);
    }

    render() {
        return <div className="trendingView scrollable">
            <PostList onShowPost={this.onShowPost.bind(this)} endpoint="trending" extraClassNames="postList" />
            <Post />
        </div>
    }
}

export default TrendingView;