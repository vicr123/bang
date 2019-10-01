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
            },
            currentPostId: -1
        };
    }

    componentDidMount() {
        this.componentDidUpdate({}, {});;
    }

    componentDidUpdate(oldProps, oldState) {
        if (this.props.postId !== -1 && this.props.postId != oldProps.postId) {
            this.setState({
                currentPostId: this.props.postId
            });
        } else if (this.state.currentPostId !== -1 && oldState.currentPostId !== this.state.currentPostId) {
            Fetch.getPost(this.state.currentPostId).then((metadata) => {
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

			let response = await Fetch.post(`/posts/${this.state.currentPostId}`, {
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
    
    renderReplies() {
        if (!this.state.metadata.comments) return [];

        let replyDivs = [];
        for (let comment of this.state.metadata.comments) {
            let changeToPost = () => {
                this.setState({
                    currentPostId: comment.id
                });
            };
            replyDivs.push(<img onClick={changeToPost} src={comment.image} className="postImage"></img>);
        }

        return replyDivs;
    }

    renderBackButton() {
        if (this.state.metadata.parent === null) {
            return [];
        } else {
            let changeToPost = () => {
                this.setState({
                    currentPostId: this.state.metadata.parent
                });
            };
            return <button onClick={changeToPost}>Back</button>
        }
    }

    getReaction(reaction) {
        if (this.state.metadata.reactions && this.state.currentPostId != -1) {
            return this.state.metadata.reactions[reaction];
        } else {
            return "";
        }
    }

    async setReaction(reaction) {
        try {
            await Fetch.post(`/posts/${this.state.currentPostId}/reactions`, {
                reaction: reaction,
                add: true
            });
    
            let metadata = this.state.metadata;
            metadata.reactions[reaction] += 1;
            this.setState({
                metadata: metadata
            });
        } catch (err) {
            Modal.mount(<Modal dismissable={true}><div>An error occurred.</div></Modal>);
        }
    }

    renderContent() {
        if (this.props.postId == -1) {
            return <div></div>
        } else {
            return <div>{this.renderBackButton()}<img src={this.state.metadata.image} className="postImage"/>
                <div className="HorizontalBox EmojiBox padded">
                    <button onClick={() => this.setReaction("👍")}>👍 {this.getReaction("👍")}</button>
                    <button onClick={() => this.setReaction("👎")}>👎 {this.getReaction("👎")}</button>
                    <button onClick={() => this.setReaction("🙂")}>🙂 {this.getReaction("🙂")}</button>
                    <button onClick={() => this.setReaction("💓")}>💓 {this.getReaction("💓")}</button>
                    <button onClick={() => this.setReaction("🙁")}>🙁 {this.getReaction("🙁")}</button>
                    <button onClick={() => this.setReaction("😠")}>😠 {this.getReaction("😠")}</button>
                    <button onClick={() => this.setReaction("😂")}>😂 {this.getReaction("😂")}</button>
                    <div style={{'flex-grow': '1'}} />
                    <button onClick={this.showFlagDialog.bind(this)}>🚩</button>
                    <button onClick={this.uploadPhotoButtonHandler.bind(this)}>Reply</button>
                    <input type="file" style={{"display": "none"}} id="replyFileSelect" onChange={this.performUpload.bind(this)} />
                </div>
                <div>
                    {this.renderReplies()}
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