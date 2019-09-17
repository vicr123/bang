class Fetch {
    static post(url, data) {
        let headers = {
            "Content-Type": "application/json"
        };

        let token = localStorage.getItem("loginToken");
        if (token != null) {
            headers["Authorization"] = "Token " + token;
        }

        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
    }
}

export default Fetch;