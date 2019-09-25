import React from 'react';
import Error from '../Error';
import Fetch from '../fetch';

class PostList extends Error {
    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        this.grabPosts();
    }

    renderPosts() {
        let jsx = [];

        console.log("renderpost");
        let numberOfPosts = this.state.posts.length;
        if (numberOfPosts > 50) numberOfPosts = 50;
        for (let i = 0; i < numberOfPosts; i++) {
            console.log("renderpostx");
            jsx.push(<PostListItem onShowPost={this.props.onShowPost} postInfo={this.state.posts[i]} />)
        }
        console.log("renderposty");

        return jsx;
    }

    render() {
        
        // <p>Empty 😔</p>
        return (
            <div className="sidebar scrollable">
                {this.renderPosts()}
            </div>
        );
    }
    // Grabs the necessary posts from the back end 
    // check if current state is new or trending 
    // returns a json obj or array?

    //get posts new or trending
    //get post ids
    //get user ids
    //get user names
    async grabPosts() {
        let posts = await Fetch.get(`/posts/${this.props.endpoint}`);

        let postArray = [];
        for (let post of posts) {
            // let jsPost = await Fetch.get(`/posts/${post}`);
            // postArray.push(jsPost);
            postArray.push(await Fetch.getPost(post));
        }

        this.setState({
            posts: postArray
        });
    }

}

class PostListItem extends Error {

    className() {
        let classes = [];
        classes.push("listItem")

        if (this.props.selected) {
            classes.push("selected");
            
        }
        return classes.join(" ");
    }

    styles() {
        return {
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${this.props.postInfo.image}) center center/cover`,
            height: '80px'
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