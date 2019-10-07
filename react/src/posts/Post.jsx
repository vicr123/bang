import React from 'react';
import Error from '../Error';
import Fetch from "../fetch";
import Modal from "../Modal";
import Tooltip from '../Tooltip';
import Spinner from '../Spinner';
import LoginHandler from '../LoginHandler';

import LoadErrorImage from '../assets/loaderror.svg';
import DeletedImage from '../assets/deleted.svg';

//Preload image
let image = new Image().src = LoadErrorImage;
let image2 = new Image().src = DeletedImage;

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
            currentPostId: -1,
            loading: "no",
            maxReplies: 5
        };
        
        LoginHandler.on("loginDetailsChanged", () => {
            Promise.resolve().then(() => this.getPost());
        });
    }
    
    invalidate() {
//         Fetch.invalidatePost(this.state.currentPostId);
        //Invalidate all posts
        Fetch.invalidatePost();
        this.getPost();
    }
    
    getPost() {
        this.setState({
            loading: "yes"
        }, async () => {
            try {
                let metadata = await Fetch.getPost(this.state.currentPostId)
                this.setState({
                    metadata: metadata,
                    userMetadata: await Fetch.getUser(metadata.user),
                    loading: "no",
                    maxReplies: 5
                });
            } catch (err) {
                this.setState({
                    loading: "error"
                });
            }
        })
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
        
        let flagPost = async (flagType) => {
            try {
                await Fetch.post(`/posts/${this.state.currentPostId}/flag`, {
                    reason: flagType
                });
                Modal.mount(<Modal title="Flag" cancelable={true} width={400}>
                    <div className="VerticalBox">
                        <span>Thanks for the report. We'll look into it.</span>
                        <button onClick={Modal.unmount}>OK</button>
                    </div>
                </Modal>)
            } catch (err) {
                let showDefaultError = true;
                if (err.status === 400) {
                    let json = await err.json();
                    if (json.error === "Already Flagged") {
                        Modal.mount(<Modal title="Flag" cancelable={true} width={400}>
                            <div className="VerticalBox">
                                <span>You've already flagged this message and we're looking into it. Thanks for the report!</span>
                                <button onClick={Modal.unmount}>OK</button>
                            </div>
                        </Modal>)
                        showDefaultError = false;
                    }
                }
                
                if (showDefaultError) Modal.mount(<Modal title="Flag" cancelable={true} width={400}>
                    <div className="VerticalBox">
                        <span>We couldn't flag this message. Please try again in a few minutes.</span>
                        <button onClick={Modal.unmount}>OK</button>
                    </div>
                </Modal>)
            }
        }
        
        Modal.mount(<Modal title="Flag" cancelable={true} width={400}>
            <div className="VerticalBox">
                <span>What's wrong with this post?</span>
                <button onClick={() => flagPost(0)}>Contains Text</button>
                <button onClick={() => flagPost(1)}>Contains Advertising</button>
                <button onClick={() => flagPost(2)}>Contains Graphic Content</button>
                <button onClick={() => flagPost(3)}>Contains Explicit Content</button>
                <button onClick={() => flagPost(4)}>Contains Hateful Content</button>
                <button onClick={() => flagPost(5)}>Contains Other Unfortunate Content</button>
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
            try {
                await Fetch.delete(`/posts/${this.state.currentPostId}`);
                Modal.unmount();
                
                if (this.state.metadata.comments.length === 0) {
                    this.setState({
                        loading: "deleted"
                    });
                } else {
                    //Rerender this post
                    Fetch.invalidatePost(this.state.currentPostId);
                    this.getPost();
                }
            } catch (err) {
                Modal.mount(<Modal title="Delete" cancelable={true} width={400}>
                    <div className="VerticalBox">
                        <span>We couldn't delete your post. Give it another go.</span>
                        <div className="horizontalBox">
                            <button onClick={Modal.unmount}>OK</button>
                        </div>
                    </div>
                </Modal>)
            }
        }

        Modal.mount(<Modal title="Delete" cancelable={true} width={400}>
            <div className="VerticalBox">
                <span>You are about to delete this post.</span>
                <span>This cannot be undone.</span>
                <span>Are you sure you wish to continue?</span>
                <div className="horizontalBox">
                    <button className="deleteButton" onClick={yesButtonHandler}>Yes</button>
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
    
    scrollHandler(e) {
        let container = e.target;
        if (container.clientHeight * 1.5 > container.scrollHeight - container.scrollTop) {
            //Load the next set of replies
            this.setState(function(state) {
                if (!state.metadata.comments) return {};
                let replies = state.maxReplies;
                replies += 5;
                if (replies > state.metadata.comments.length) replies = state.metadata.comments.length;
                return {
                    maxReplies: replies
                }
            });
        }
    }
    
    renderReplies() {
        if (!this.state.metadata.comments) return [];

        let replyDivs = [];
        let numReplies = this.state.metadata.comments.length;
        if (numReplies > this.state.maxReplies) numReplies = this.state.maxReplies;
        
        for (let i = 0; i < numReplies; i++) {
            let comment = this.state.metadata.comments[i];
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
        if (this.state.metadata.parent != null) {
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
        if (LoginHandler.loginDetails.id === this.state.metadata.user && !this.state.metadata.deleted) return <Tooltip text="Remove Post"><button onClick={this.trashButtonHandler.bind(this)}>🗑</button></Tooltip>
        return null;
    }

    renderEditButton() {
        if (this.state.metadata.canEdit && !this.state.metadata.deleted) return <Tooltip text="Edit Post"><button onClick={this.editButtonHandler.bind(this)}>✏</button></Tooltip>
        return null;
    }
    
    renderFlagButton() {
        if (!this.state.metadata.deleted) return <Tooltip text="Flag Post"><button onClick={this.showFlagDialog.bind(this)}>🚩</button></Tooltip>;
        return null;
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
            return <div className="postImageContainer deleted">
                <img src={DeletedImage} />
                It's gone. Someone (probably the poster) got rid of this image.
            </div>
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
        if (this.state.currentPostId == -1) return <div></div>
        if (this.state.loading == "no") {
            return <div>
                <div className="HorizontalBox">{this.renderBackButton()}</div>
                {this.renderImage()}
                <div className="HorizontalBox padded">
                    <p>Posted by: {this.state.userMetadata ? this.state.userMetadata.username : "Unidentified user"}</p>                   
                    <div style={{'flex-grow': '1'}} />
                    {this.renderFlagButton()}
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
        } else if (this.state.loading == "error") {
            return <div className="postError">
                <img src={LoadErrorImage} />
                Take a deep breath and try again.
                <button onClick={this.getPost.bind(this)}>Give it another go</button>
                {this.renderBackButton()}
            </div>
        } else if (this.state.loading == "deleted") {
            return <div className="postError">
                <img src={DeletedImage} />
                It's gone.
                {this.renderBackButton()}
            </div>
        } else {
            return <div className="postError"><Spinner /></div>
        }
    }

    render() {
        return <div className={this.className()} onScroll={this.scrollHandler.bind(this)} style={{'flex-grow': '1'}}>
            {this.renderContent()}
        </div>
    }

    
}

export default Post;