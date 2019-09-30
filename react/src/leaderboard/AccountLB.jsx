import React from "react";
import Fetch from '../fetch';
import Error from "../Error";

// rendered based on user profile on the leaderboard
class AccountLB extends Error {
	constructor(props) {
		super(props);

		this.state = {
			userId: -1,
			reacts: 0
		};
	}
	render() {
		if(this.state.userId !== -1)
			return <React.Fragment>An Account should be here</React.Fragment>;
		else 
			this.defaultRender();
	}

	defaultRender(){
		return <React.Fragment>This account is a mystery</React.Fragment>;
	}

}

export default AccountLB;
