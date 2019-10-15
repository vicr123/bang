import React from 'react';
import Loader from './Loader';
import Modal from './Modal';

let posts = {};
let user = {};


// Fetch is a custom wrapper around the fetch API.
class Fetch {
    /**
     * Define and create custom headers for Fetch requests
     */
    static headers() {
        let headers = {
            "Content-Type": "application/json"
        };
        // look for token in local storage, create new token if null
        let token = localStorage.getItem("loginToken");
        if (token != null) {
            headers["Authorization"] = "Token " + token;
        }
        
        return headers;
    }
    /**
     * Uses fetch to make a request to the in-house API
     * @param {string} method Type of request to make
     * @param {string} url endpoint for the API call
     * @param {boolean} showLoader if true displays a loading animation
     */
    static async performRequest(method, url, showLoader) {
        let err = null;
        // Display loading animation for the user
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: method,
            headers: Fetch.headers()
        }).catch((error) => {
            err = error;
        }).finally(() => {
            if (showLoader) Loader.unmount();
        });
        
        if (err) throw err;
        if (result.status == 204) return {};
        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    /**
     * Use fetch's post request 
     * @param {string} url endpoint for fetch request
     * @param {Object} data payload of information
     * @param {boolean} showLoader if true displays a loading animation
     */
    static async post(url, data, showLoader = true) {
        let err = null;
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: "POST",
            headers: Fetch.headers(),
            body: JSON.stringify(data)
        }).catch((error) => {
            err = error;
        }).finally(() => {
            if (showLoader) Loader.unmount();
        });
        
        if (err) throw err;
        if (result.status == 204) return {};
        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    /**
     * Use fetch's patch request 
     * @param {string} url API endpoint to access
     * @param {Object} data Payload to patch with
     * @param {boolean} showLoader if true displays a loading animation 
     */
    static async patch(url, data, showLoader = true) {
        let err = null;
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: "PATCH",
            headers: Fetch.headers(),
            body: JSON.stringify(data)
        }).catch((error) => {
            err = error;
        }).finally(() => {
            if (showLoader) Loader.unmount();
        });
        
        if (err) throw err;
        if (result.status == 204) return {};
        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    /**
     * GET request to specific url, used to access in-house API
     * @param {string} url url to perform API request
     * @param {boolean} showLoader boolean value to display loading animation
     */
    static get(url, showLoader = true) {
        return Fetch.performRequest("GET", url, showLoader);
    }
    /**
     * DELETE request to specified url
     * @param {string} url url to perform API request
     * @param {boolean} showLoader boolean value to display loading animation
     */
    static delete(url, showLoader = true) {
        return Fetch.performRequest("DELETE", url, showLoader);
    }
    /**
     * Retrieves post based on postID 
     * @param {number} id postID
     */
    static async getPost(id) {
        if (!posts[id]) {
            posts[id] = await Fetch.get(`/posts/${id}`, false);
        }
        return posts[id];
    }
    /**
     * Get the user based on userID
     * @param {number} id userID from the backend
     */
    static async getUser(id) {
        if (!user[id]) {
            user[id] = await Fetch.get(`/users/${id}`, false);
        }
        return user[id];
    }
    /**
     * Remove garbage posts with an illegal ID 
     * @param {number} id postID
     */
    static invalidatePost(id = -1) {
        if (id === -1) {
            posts = {};
        } else if (posts.hasOwnProperty(id)) {
            delete posts[id];
        }
    }
    
    static invalidateUser(id) {
        if (user.hasOwnProperty(id)) delete user[id];
    }
    /**
     * Reset objects
     */
    static invalidate() {
        posts = {};
        user = {};
    }
    /**
     * Upload the image to the database with either a PATCH or POST request
     * @param {string} method Fetch method to be called 
     * @param {string} endpoint API routing 
     * @param {string} file 
     */
    static uploadImage(method, endpoint, file) {
        return new Promise(async function(res, rej) {
    		let reader = new FileReader();
    		reader.addEventListener("load", async () => {
                try {
        			let result = reader.result;
        			let mimetype = result.substr(5, result.indexOf(';') - 5);
        			result = result.substr(result.indexOf(',') + 1);
        
                   let methodToCall = (method == "patch" ? Fetch.patch : Fetch.post);
        
        			let response = await methodToCall(endpoint, {
        				"image": result,
        				"mime": mimetype
        			});
                    res(response);
                } catch (err) {
                    let showCatchAllError = true;
                    if (err.status === 413) {
                        Modal.mount(<Modal title="Image Too Large" width={400} cancelable={true}>
                            <p>We can't accept this image because it's too large. Here are some things you can try to reduce the size of this image.</p>
                            <ul>
                                <li>Make the image smaller using a image editor.</li>
                                <li>Save the image in a different format.</li>
                                <li>Reduce the quality of the image.</li>
                            </ul>
                            <p>The image needs to be smaller than 10 MB.</p>
                            <button onClick={Modal.unmount}>OK</button>
                        </Modal>)
                        showCatchAllError = false;
                    } else if (err.status === 400) {
                        let json = await err.json();
                        if (json.error === "Not an image") {
                            Modal.mount(<Modal title="Not an image" width={400} cancelable={true}>
                                <p>You're trying to upload a file that does not contain image data.</p>
                                <button onClick={Modal.unmount}>OK</button>
                            </Modal>)
                            showCatchAllError = false;
                        }
                    }
                    
                    if (showCatchAllError) {
                        Modal.mount(<Modal title="Upload Failed" width={400} cancelable={true}>
                            <p>We couldn't upload your image.</p>
                            <button onClick={Modal.unmount}>OK</button>
                        </Modal>)
                    }
                    res(null);
                }
    		})
    		reader.readAsDataURL(file);
        });
	}
}

export default Fetch;