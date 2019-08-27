import React from 'react';
import Error from '../Error'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class TrendingView extends Error {
    render() {
        return <div className="trendingView scrollable">
            <PostList extraClassNames="postList" />
            <Post />
        </div>
    }
}

export default TrendingView;