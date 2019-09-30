import React from "react";
import Error from "../Error";
import Fetch from "../fetch";
import Post from "../posts/Post";

class CreatePost extends Error {	
	constructor(props) {
		super(props);

		this.state = {
			newPostId: -1
		}
	}

	uploadPhotoButtonHandler() {
		document.getElementById("inputFileSelect").click();
	}

	performUpload(event) {
		let box = document.getElementById("inputFileSelect");
		let file = box.files[0];
		let reader = new FileReader();
		reader.addEventListener("load", async () => {
			let result = reader.result;
			let mimetype = result.substr(5, result.indexOf(';') - 5);
			result = result.substr(result.indexOf(',') + 1);

			let response = await Fetch.post("/posts/create", {
				"image": result,
				"mime": mimetype
			});
			this.setState({
				newPostId: response.id
			})
		})
		reader.readAsDataURL(file);

	}
	render() {
		if (this.state.newPostId == -1) {
			return (
				<React.Fragment>
					<div className="padded moreSpace postContainer">
						<h2>Upload a photo to get started!</h2>
						<button className="button" onClick={this.uploadPhotoButtonHandler.bind(this)}>📸 Upload Photo</button>
						<input type="file"  style={{"display": "none"}} id="inputFileSelect" onChange={this.performUpload.bind(this)} />
						<p>
							If you put text in the image we are gonna nuke your post from orbit so don't try it son.
						</p>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<Post postId={this.state.newPostId}/>
			);
		}
	}
}

export default CreatePost;
