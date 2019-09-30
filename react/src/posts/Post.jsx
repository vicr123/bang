import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";
import Modal from "../Modal";

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
        this.componentDidUpdate({});;
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

    showFlagDialog() {
        Modal.mount(<Modal title="Flag" cancelable={true} style={{width: '400px'}}>
            <div className="VerticalBox">
                <span>What's wrong with this post?</span>
                <button>Contains Text</button>
                <button>Contains Unfortunate Content</button>
                <hr />
                <span>This report will be sent to the administrators of this board; not the author of this post.</span>
            </div>
        </Modal>)
    }

    uploadPhotoButtonHandler() {
		document.getElementById("replyFileSelect").click();
	}
    
    performUpload(event) {
		let box = document.getElementById("replyFileSelect");
		let file = box.files[0];
		let reader = new FileReader();
		reader.addEventListener("load", async () => {
			let result = reader.result;
			let mimetype = result.substr(5, result.indexOf(';') - 5);
			result = result.substr(result.indexOf(',') + 1);

			let response = await Fetch.post(`/posts/${this.props.postId}`, {
				"image": result,
				"mime": mimetype
			});
			// this.setState({
			// 	newPostId: response.id
            // })
            alert("Replied. Post needs to be reloaded!");
		})
		reader.readAsDataURL(file);

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
                    <button onClick={this.showFlagDialog.bind(this)}>🚩</button>
                    <button onClick={this.uploadPhotoButtonHandler.bind(this)}>Reply</button>
                    <input type="file" style={{"display": "none"}} id="replyFileSelect" onChange={this.performUpload.bind(this)} />
                </div>
            </div>
        }
    }

    render() {
        return <div className="scrollable" style={{'flex-grow': '1'}}>
            {this.renderContent()}
        </div>
        
    }

    
}

export default Post;