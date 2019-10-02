import Loader from './Loader';

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
    }

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
}

export default Fetch;