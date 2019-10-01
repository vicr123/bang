import React from "react";
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
		console.log(this.props.person);

		if(this.state.userId !== -1)
			this.accountRender();
		else 
			this.defaultRender();
	}

	accountRender(){
		return <React.Fragment>An Account should be here {this.props.person}</React.Fragment>;
	}

	defaultRender(){
		return <React.Fragment>No Account to be found :'(</React.Fragment>;
	}

}

export default AccountLB;
