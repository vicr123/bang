import Fetch from './fetch';
import Events from 'events';

let loginDetails = {};

// State handler for log in
class LoginHandler extends Events.EventEmitter {
    
    async reloadLogin() {
        let setDetails = (details) => {
            loginDetails = details;
            this.emit("loginDetailsChanged", details);
        }
        
		let token = localStorage.getItem("loginToken");
		if (token == null) {
            setDetails({});
		} else {
            try {
                setDetails(await Fetch.get("/users/whoami", false));
            } catch (err) {
                setDetails({});
                localStorage.removeItem("loginToken");
            }
		}
    }
    
    get loginDetails() {
        return loginDetails;
    }
}

let handler = new LoginHandler;

export default handler;