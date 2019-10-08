import React from "react";
import Error from "../Error";
import Fetch from "../fetch";

// rendered based on user profile on the leaderboard
class AccountLB extends Error {
	constructor(props) {
		super(props);
		this.state = {
			username: null
		};

		this.getAccountDetails().then((user) => {
			this.setState({
				username: user
			});
		})

	}
	render() {

		if(this.props.person !== -1)
			return this.accountRender();
		else 
			return this.defaultRender();
	}
	// Render the account with details
	accountRender(){
		return (
			<div className="LBBox">{this.state.username}</div>
		);
	}
	// Render based on userID error
	defaultRender(){
		return <React.Fragment>No Account to be found :'(</React.Fragment>;
	}

	// Retrieves the username based on the user id 
	async getAccountDetails(){
		let userName = await Fetch.getUser(this.props.person);
		return userName.username; 
	}

}

export default AccountLB;
