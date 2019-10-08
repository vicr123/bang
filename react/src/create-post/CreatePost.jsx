import React from "react";
import Error from "../Error";
import Fetch from "../fetch";
import Post from "../posts/Post";
import Modal from "../Modal";

class CreatePost extends Error {	
	constructor(props) {
		super(props);

		this.state = {
			newPostId: -1
		}
	}

	uploadPhotoButtonHandler() {
		if (!Modal.checkLoggedIn()) return;
		document.getElementById("inputFileSelect").click();
	}

	async performUpload(event) {
        let response = await Fetch.uploadImage("post", "/posts/create", document.getElementById("inputFileSelect").files[0]);
        if (response != null) {
			this.setState({
				newPostId: response.id
			});
        }
	}

	render() {
		if (this.state.newPostId == -1) {
			return (
				<React.Fragment>
					<div className="padded moreSpace postContainer">
						<h2>Upload a photo to get started!</h2>
						<button className="button" onClick={this.uploadPhotoButtonHandler.bind(this)}>📸 Upload Photo</button>
						<input type="file" accept="image/*" style={{"display": "none"}} id="inputFileSelect" onChange={this.performUpload.bind(this)} />
						<p>
							You can upload any image you want, as long as it adheres to the rules on the <a href="/about" onClick={this.props.onShowAboutPage}>About page</a> (that means no text or unfortunate content)
						</p>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<Post viewMobile={true} postId={this.state.newPostId}/>
			);
		}
	}
}

export default CreatePost;