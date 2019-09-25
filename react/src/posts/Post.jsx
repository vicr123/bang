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

    renderContent() {
        if (this.props.postId == -1) {
            return <div></div>
        } else {
            return <div><img src={this.state.metadata.image} className="postImage"/>
                <div className="HorizontalBox EmojiBox padded">
                    <button>👍</button>
                    <button>👎</button>
                    <button>🙂</button>
                    <button>💓</button>
                    <button>🙁</button>
                    <button>😠</button>
                    <button>😂</button>
                    <div style={{'flex-grow': '1'}} />
                    <button>🚩</button>
                    <button>Reply</button>
                </div>
            </div>
        }
    }

    render() {
        return <div className="scrollable">
            {this.renderContent()}
        </div>
        
    }

    
}

export default Post;