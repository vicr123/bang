import Loader from './Loader';

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
        
        return result;
    }
    
    static get(url, showLoader = true) {
        return Fetch.performRequest("GET", url, showLoader);
    }
}

export default Fetch;