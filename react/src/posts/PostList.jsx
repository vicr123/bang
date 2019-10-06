import React from 'react';
import Error from '../Error';
import Fetch from '../fetch';
import Spinner from '../Spinner';

import ReachedEndImage from '../assets/reachedend.svg';
import LoadErrorImage from '../assets/loaderror.svg';

const limit = 10;
const initialState = {
    posts: [],
    offset: 0,
    finishedLoading: "no",
    loading: false
}

//Preload images
let image1 = new Image().src = ReachedEndImage;
let image2 = new Image().src = LoadErrorImage;

class PostList extends Error {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            offset: 0,
            finishedLoading: "no",
            loading: false
        };
    }

    componentDidMount() {
        this.grabPosts();
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.endpoint !== prevProps.endpoint) {
            //Re-initialize the state
            //Defer the grabPosts call until the state has been set
            this.setState({
                posts: [],
                offset: 0,
                finishedLoading: "no",
                loading: false
            }, this.grabPosts);
        }
    }


    renderPosts() {
        let jsx = [];

        for (let i = 0; i < this.state.posts.length; i++) {
            jsx.push(<PostListItem onShowPost={this.props.onShowPost} postInfo={this.state.posts[i]} />)
        }
        return jsx;
    }
    
    className() {
        let classes = [];
        classes.push("postbar");
        classes.push("scrollable");
        if (!this.props.viewMobile) classes.push("mobileHide");
        
        return classes.join(" ");
    }
    
    scrollHandler(e) {
        let container = e.target;
        if (container.clientHeight * 1.5 > container.scrollHeight - container.scrollTop) {
            //Load the next set of images
            this.grabPosts();
        }
    }
    
    renderLoader() {
        if (this.state.finishedLoading == "yes") {
            return <div class="postListEnd"><img src={ReachedEndImage} />You've reached the end!</div>
        } else if (this.state.finishedLoading == "error") {
            let loadPosts = () => {
                this.setState({
                    finishedLoading: "no"
                }, this.grabPosts);
            };
            
            return <div class="postListEnd"><img src={LoadErrorImage} />Take a deep breath and try again.<button onClick={loadPosts}>Give it another go</button></div>
        } else {
            return <div class="postListEnd"><Spinner /></div>
        }
    }

    render() {
        return (
            <div className={this.className()} onScroll={this.scrollHandler.bind(this)}>
                {this.renderPosts()}
                {this.renderLoader()}
            </div>
        );
    }
    // Grabs the necessary posts from the backend 
    async grabPosts() {
        //Don't bother loading anything if we're currently loading, if we've loaded everything or if there was an error last time
        if (this.state.loading || this.state.finishedLoading == "yes" || this.state.finishedLoading == "error") return;
        
        //Set the loading flag
        this.setState({
            loading: true
        });
        
        try {
            let queryString = `limit=${limit}&from=${this.state.offset}`;
            let posts = await Fetch.get(`/posts/${this.props.endpoint}?${queryString}`, false);
            
            let newPosts = [];
            let newPostPromises = [];
            for (let post of posts) {
                newPostPromises.push(Fetch.getPost(post).then(function(postData) {
                    newPosts.push(postData);
                }));
            }
            
            await Promise.all(newPostPromises);
            
            this.setState(function(state, props) {
                let postArray = state.posts;
                
                for (let post of newPosts) {
                    postArray.push(post);
                }
                
                return {
                    posts: postArray,
                    loading: false,
                    offset: state.offset + posts.length,
                    finishedLoading: posts.length != limit ? "yes" : "no"
                }
            });
        } catch (err) {
            this.setState({
                finishedLoading: "error",
                loading: false
            });
        }
    }

}

class PostListItem extends Error {

    className() {
        let classes = [];
        classes.push("listItem");
        classes.push("postListItems");

        if (this.props.selected) {
            classes.push("selected");
            
        }
        return classes.join(" ");
    }

    styles() {
        return {
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${this.props.postInfo.image}) center center/cover`
        }
    }

    onClick() {
        this.props.onShowPost(this.props.postInfo);
    }

    render() {
        return (
            <div className={this.className()} onClick={this.onClick.bind(this)} style={this.styles()}>
            </div>
        );
    }

}

export default PostList;