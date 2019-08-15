import React from 'react';
import Component from '../Component'
import PostList from './PostList';
import Post from './Post';

import "./TrendingView.css";

class TrendingView extends Component {
    render() {
        return <div className="trendingView">
            <PostList extraClassNames="postList" />
            <Post />
        </div>
    }
}

export default TrendingView;