import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";
import Modal from "../Modal";
import Tooltip from '../Tooltip';

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
            Modal.mount(<Modal cancelable={true} title="Couldn't post reaction">
                <p>We couldn't post your reaction. Give it another go.</p>
                <p>If you keep hitting problems, try reloading the page.</p>
                <button onClick={Modal.unmount}>OK</button>
            </Modal>);
        }
    }
    
    className() {
        let classes = [];
        classes.push("emojiButton");
        if (this.hasUserReacted()) classes.push("selected");
        return classes.join(" ");
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
    
    invalidate() {
//         Fetch.invalidatePost(this.state.currentPostId);
        //Invalidate all posts
        Fetch.invalidatePost();
        this.getPost();
    }
    
    async getPost() {
        let metadata = await Fetch.getPost(this.state.currentPostId)
        this.setState({
            metadata: metadata,
            userMetadata: await Fetch.getUser(metadata.user)
        });
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
            this.getPost();
        }
    }

    showFlagDialog() {
        if (!Modal.checkLoggedIn()) return;    
        Modal.mount(<Modal title="Flag" cancelable={true} width={400}>
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

        let yesButtonHandler = async () => {
            await Fetch.delete(`/posts/${this.state.currentPostId}`);
            Modal.unmount();
        }

        Modal.mount(<Modal title="Delete" cancelable={true} width={400}>
            <div className="VerticalBox">
                <span>You are about to delete this post.</span>
                <span>This cannot be undone.</span>
                <span>Are you sure you wish to continue?</span>
                <div className="horizontalBox">
                    <button onClick={yesButtonHandler}>Yes</button>
                    <button onClick={Modal.unmount}>No</button>
                </div>
            </div>        
        </Modal>)
    }

    editButtonHandler() {
        if (!Modal.checkLoggedIn()) return;
        document.getElementById("editFileSelect").click();
    }

    async postImage(isEdit) {
		let box = isEdit ? document.getElementById("editFileSelect") : document.getElementById("replyFileSelect");
        let method = isEdit ? "patch" : "post";
        let response = await Fetch.uploadImage(method, `/posts/${this.state.currentPostId}`, box.files[0]);
        if (response != null) {
            this.invalidate();
        }
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
        return <Tooltip text="Remove Post"><button onClick={this.trashButtonHandler.bind(this)}>🗑</button></Tooltip>
    }

    renderEditButton() {
        if (this.state.metadata.canEdit) return <Tooltip text="Edit Post"><button onClick={this.editButtonHandler.bind(this)}>✏</button></Tooltip>
        return [];
    }
    
    className() {
        let classes = [];
        classes.push("scrollable");
        if (!this.props.viewMobile) classes.push("mobileHide");
        return classes.join(" ");
    }
    
    renderSmallEmoji() {
        if (!this.state.metadata.reactions) return null;
        
        let els = [];
        for (let reaction in this.state.metadata.reactions) {
            let count = this.state.metadata.reactions[reaction];
            if (count > 0) els.push(<span>{reaction} {count}</span>);
        }
        
        if (els.length > 0) {
            return <div className="HorizontalBox SmallEmojiBox">
                <div className="HorizontalBox SmallEmojiBoxInner">
                    {els}
                </div>
            </div>
        } else {
            return null;
        }
    }

    renderImage() {
        if (this.state.metadata.deleted) {
            return <div>Image Deleted.</div>
        } else {
            return <div className="postImageContainer">
                {this.renderSmallEmoji()}
                <div className="HorizontalBox EmojiBox">
                    <EmojiButton emoji="👍" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="👎" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="🙂" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="💓" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="🙁" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="😠" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                    <EmojiButton emoji="😂" metadata={this.state.metadata} postId={this.state.currentPostId} onStateChange={this.setState.bind(this)} />
                </div>
                <img src={this.state.metadata.image} className="postImage"/>
            </div>
        }
    }

    renderContent() {
        if (this.props.postId == -1) {
            return <div></div>
        } else {
            return <div>
                <div className="HorizontalBox">{this.renderBackButton()}</div>
                {this.renderImage()}
                <div className="HorizontalBox padded">
                    <p>Posted by: {this.state.userMetadata ? this.state.userMetadata.username : "Unidentified user"}</p>                   
                    <div style={{'flex-grow': '1'}} />
                    <Tooltip text="Flag Post"><button onClick={this.showFlagDialog.bind(this)}>🚩</button></Tooltip>
                    {this.renderEditButton()}
                    {this.renderTrashButton()}
                    <Tooltip text="Reply"><button onClick={this.uploadPhotoButtonHandler.bind(this)}>📨</button></Tooltip>
                    <input type="file" accept="image/*" style={{"display": "none"}} id="replyFileSelect" onChange={() => {this.postImage(false)}} />
                    <input type="file" accept="image/*" style={{"display": "none"}} id="editFileSelect" onChange={() => {this.postImage(true)}} />
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