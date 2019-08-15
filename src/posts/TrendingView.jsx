import React from 'react';
import Component from '../Component'
import PostList from './PostList';
import Post from './Post';

class TrendingView extends Component {
    render() {
        return <div>
            <PostList />
            <Post />
        </div>
    }
}

export default TrendingView;