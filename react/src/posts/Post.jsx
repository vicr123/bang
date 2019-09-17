import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";

class Post extends Error {
    render() {
        return <div>
            <p>This is where a post will go. Reactions and "Bottles" will appear under this post. A flag option will also appear for reporting posts for inappropriate content.</p>
        </div>
        
    }

    
}

export default Post;