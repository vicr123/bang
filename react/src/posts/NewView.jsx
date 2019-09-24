import React from 'react';
import Error from '../Error'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class NewView extends Error {
    render() {
        return <div className="trendingView scrollable">
            <PostList endpoint="new" extraClassNames="postList" />
            <Post />
        </div>
    }
}

export default NewView;