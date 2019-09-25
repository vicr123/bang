import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";

class Post extends Error {
    constructor(props) {
        super(constructor);



        this.state = {
            metadata: {
                image: ""
            }
        };
    }

    componentDidMount() {
        this.componentDidUpdate(this.props);
    }

    componentDidUpdate(oldProps) {
        if (this.props.postId !== -1 && this.props.postId != oldProps.postId) {
            console.log("get");
            Fetch.getPost(this.props.postId).then((metadata) => {
                console.log("set");
                this.setState({
                    metadata: metadata
                });
            });
        }
    }

    render() {
        return <div>
            <p>This is where a post will go. Reactions and "Bottles" will appear under this post. A flag option will also appear for reporting posts for inappropriate content.</p>
            <img src={this.state.metadata.image}>
                
            </img>
        </div>
        
    }

    
}

export default Post;