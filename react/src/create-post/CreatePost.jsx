import React from "react";
import Error from "../Error";
import Fetch from "../fetch";

class CreatePost extends Error {
	state = {};
	
	uploadPhotoButtonHandler() {
		document.getElementById("inputFileSelect").click();
	}

	performUpload(event) {
		let box = document.getElementById("inputFileSelect");
		let file = box.files[0];
		let reader = new FileReader();
		reader.addEventListener("load", function() {
			let result = reader.result;
			let mimetype = result.substr(5, result.indexOf(';') - 5);
			result = result.substr(result.indexOf(',') + 1);

			Fetch.post("/posts/create", {
				"image": result,
				"mime": mimetype
			});
		})
		reader.readAsDataURL(file);

	}
	render() {
		return (
			<React.Fragment>
				<div className="padded moreSpace postContainer">
					<div>&#128140;</div>
					<h2>Upload a photo to get started!</h2>
					<button className="button" onClick={this.uploadPhotoButtonHandler.bind(this)}>📸 Upload Photo</button>
					<input type="file"  style={{"display": "none"}} id="inputFileSelect" onChange={this.performUpload.bind(this)} />
					<p>
						If you put text in the image we are gonna nuke your post from orbit so don't try it son.
					</p>
				</div>
			</React.Fragment>
		);
	}
}

export default CreatePost;
