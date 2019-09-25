import React from "react";
import Error from "../Error";
import PostList from "./PostList";
import Post from "./Post";

import "./TrendingView.css";

class NewView extends Error {
	constructor(props) {
		super(props);

		this.state = {
			currentPost: -1
		};
	}

	onShowPost(post) {
		console.log(post);
		//show post in Post section
		this.setState({
			currentPost: post.id
		});
	}

	render() {
		return (
			<div className="trendingView scrollable">
				<PostList
					onShowPost={this.onShowPost.bind(this)}
					endpoint="new"
					extraClassNames="postList"
				/>
				<Post postId={this.state.currentPost} />
			</div>
		);
	}
}

export default NewView;
