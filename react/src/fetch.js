import React from 'react';
import Loader from './Loader';
import Modal from './Modal';

let posts = {};
let user = {};

class Fetch {
    static headers() {
        let headers = {
            "Content-Type": "application/json"
        };
        
        let token = localStorage.getItem("loginToken");
        if (token != null) {
            headers["Authorization"] = "Token " + token;
        }
        
        return headers;
    }
    
    static async performRequest(method, url, showLoader) {
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: method,
            headers: Fetch.headers()
        });
        if (showLoader) Loader.unmount();
        if (result.status == 204) return {};

        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    
    static async post(url, data, showLoader = true) {
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: "POST",
            headers: Fetch.headers(),
            body: JSON.stringify(data)
        });
        if (showLoader) Loader.unmount();
        
        if (result.status == 204) return {};

        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    
    static async patch(url, data, showLoader = true) {
        if (showLoader) Loader.mount();
        let result = await fetch("/api" + url, {
            method: "PATCH",
            headers: Fetch.headers(),
            body: JSON.stringify(data)
        });
        if (showLoader) Loader.unmount();
        
        if (result.status == 204) return {};

        if (result.status < 200 || result.status > 299) throw result;
        return await result.json();
    }
    
    static get(url, showLoader = true) {
        return Fetch.performRequest("GET", url, showLoader);
    }

    static delete(url, showLoader = true) {
        return Fetch.performRequest("DELETE", url, showLoader);
    }

    static async getPost(id) {
        if (!posts[id]) {
            posts[id] = await Fetch.get(`/posts/${id}`, false);
        }
        return posts[id];
    }"/posts/create"

    static async getUser(id) {
        if (!user[id]) {
            user[id] = await Fetch.get(`/users/${id}`, false);
        }
        return user[id];
    }
    
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
    
    static invalidate() {
        posts = {};
        user = {};
    }
    
    static uploadImage(method, endpoint, file) {
        return new Promise(async function(res, rej) {
    		let reader = new FileReader();
    		reader.addEventListener("load", async () => {
                try {
        			let result = reader.result;
        			let mimetype = result.substr(5, result.indexOf(';') - 5);
        			result = result.substr(result.indexOf(',') + 1);
        
                   let methodToCall = (method == "patch" ? Fetch.patch : Fetch.post)
        
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