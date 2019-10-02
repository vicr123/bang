import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";
import Modal from "../Modal";

class EmojiButton extends Error {
    constructor(props) {
        super(props)
    }
 
    getReaction(reaction) {
        if (this.props.metadata.reactions && this.props.postId != -1) {
            let num = this.props.metadata.reactions[reaction];
            if (num == 0) return "";
            return num;
        } else {
            return "";
        }
    }
    
    hasUserReacted() {
        if (!this.props.metadata.myReactions) return false;
        return this.props.metadata.myReactions.indexOf(this.props.emoji) !== -1;
    }

    async setReaction(reaction) {
        if (!Modal.checkLoggedIn()) return;

        try {
            let add = !this.hasUserReacted();
            
            await Fetch.post(`/posts/${this.props.postId}/reactions`, {
                reaction: reaction,
                add: add
            });
    
            let metadata = this.props.metadata;
            if (!metadata.reactions[reaction]) metadata.reactions[reaction] = 0;
            metadata.reactions[reaction] += (add ? 1 : -1);
            
            if (add) {
                metadata.myReactions.push(this.props.emoji);
            } else {
                metadata.myReactions.splice(metadata.myReactions.indexOf(this.props.emoji), 1);
            }
            
            this.props.onStateChange({
                metadata: metadata
            });
        } catch (err) {
            Modal.mount(<Modal cancelable={true}><h1>Error</h1><div>We couldn't post your reaction. Give it another go.</div></Modal>);
        }
    }
    
    className() {
        if (this.hasUserReacted()) return "selected";
        return "";
    }
    
    render() {
        return <button className={this.className()} onClick={() => this.setReaction(this.props.emoji)}>{this.props.emoji} {this.getReaction(this.props.emoji)}</button>
    }
}

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
            Fetch.getPost(this.state.currentPostId).then(async (metadata) => {
                this.setState({
                    metadata: metadata,
                    userMetadata: await Fetch.getUser(metadata.user)
                });
            });
        }
    }

    showFlagDialog() {
        if (!Modal.checkLoggedIn()) return;    
        Modal.mount(<Modal title="Flag" cancelable={true} style={{width: '400px'}}>
            <div className="VerticalBox">
                <span>What's wrong with this post?</span>
                <button>Contains Text</button>
                <button>Contains Unfortunate Content</button>
                <span>This report will be sent to the administrators of this board; not the author of this post.</span>
            </div>
        </Modal>)
    }

    uploadPhotoButtonHandler() {
        if (!Modal.checkLoggedIn()) return;
		document.getElementById("replyFileSelect").click();
    }
    
    async trashButtonHandler() {
        if (!Modal.checkLoggedIn()) return;
        await Fetch.delete(`/posts/${this.state.currentPostId}`);
        alert("Deleted. Reload to see changes.");
    }

    editButtonHandler() {
        if (!Modal.checkLoggedIn()) return;
        document.getElementById("editFileSelect").click();
    }

    postImage(isEdit) {
		let box = isEdit ? document.getElementById("editFileSelect") : document.getElementById("replyFileSelect");
		let file = box.files[0];
		let reader = new FileReader();
		reader.addEventListener("load", async () => {
			let result = reader.result;
			let mimetype = result.substr(5, result.indexOf(';') - 5);
            result = result.substr(result.indexOf(',') + 1);
            
            let functionToCall = isEdit ? Fetch.patch : Fetch.post;

			let response = await functionToCall(`/posts/${this.state.currentPostId}`, {
				"image": result,
				"mime": mimetype
			});
            if (isEdit) {
                alert("Edited. Post needs to be reloaded!");
            } else {
                alert("Replied. Post needs to be reloaded!");
            }
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
        let buttons = [];
        buttons.push(<button className="returnToPostListButton" onClick={this.props.onReturnToPostList}>Back to post list</button>);
        if (this.state.metadata.parent !== null) {
            let changeToPost = () => {
                this.setState({
                    currentPostId: this.state.metadata.parent
                });
            };
            buttons.push(<button onClick={changeToPost}>Back</button>);
        }
        return buttons;
    }

    renderTrashButton() {
        return <button onClick={this.trashButtonHandler.bind(this)}>🗑</button>
    }

    renderEditButton() {
        if (this.state.metadata.canEdit) return <button onClick={this.editButtonHandler.bind(this)}>✏</button>
        return [];
    }
    
    className() {
        let classes = [];
        classes.push("scrollable");
        if (!this.props.viewMobile) classes.push("mobileHide");
        return classes.join(" ");
    }

    renderImage() {
        if (this.state.metadata.deleted) {
            return <div>Image Deleted.</div>
        } else {
            return <img src={this.state.metadata.image} className="postImage"/>
        }
    }

    renderContent() {
        if (this.props.postId == -1) {
            return <div></div>
        } else {
            return <div>
                <div className="HorizontalBox">{this.renderBackButton()}</div>
                {this.renderImage()}
                <div className="HorizontalBox EmojiBox padded">
                    <EmojiButton emoji="👍" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="👎" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="🙂" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="💓" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="🙁" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="😠" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="😂" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <div style={{'flex-grow': '1'}} />
                    <p>Posted by: {this.state.userMetadata ? this.state.userMetadata.username : "Unidentified user"}</p>
                    <button onClick={this.showFlagDialog.bind(this)}>🚩</button>
                    {this.renderEditButton()}
                    {this.renderTrashButton()}
                    <button onClick={this.uploadPhotoButtonHandler.bind(this)}>📨</button>
                    <input type="file" style={{"display": "none"}} id="replyFileSelect" onChange={() => {this.postImage(false)}} />
                    <input type="file" style={{"display": "none"}} id="editFileSelect" onChange={() => {this.postImage(true)}} />
                </div>
                <div>
                    {this.renderReplies()}
                </div>
            </div>
        }
    }

    render() {
        return <div className={this.className()} style={{'flex-grow': '1'}}>
            {this.renderContent()}
        </div>
    }

    
}

export default Post;