import Fetch from './fetch';
import Events from 'events';

let loginDetails = {};

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
                //TODO: Inform the user that we couldn't log them back in
            }
		}
    }
    
    get loginDetails() {
        return loginDetails;
    }
}

let handler = new LoginHandler;

export default handler;