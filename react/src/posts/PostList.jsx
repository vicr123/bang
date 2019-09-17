import React from 'react';
import Error from '../Error'

class PostList extends Error {
    render(){
        return (
            <div className="sidebar">
                <p>Empty 😔</p>
            </div>
        );
    }
    // Grabs the necessary posts from the back end 
    // check if current state is new or trending 
    // returns a json obj or array?
    grabPosts(){

    }
}

export default PostList;