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
		console.log(this.props.person);

		if(this.props.person !== -1)
			return this.accountRender();
		else 
			return this.defaultRender();
	}

	accountRender(){
		return (
			<div className="LBBox">USERID:  {this.props.person}
				USERNAME: {this.state.username}
			</div>
		);
	}

	defaultRender(){
		return <React.Fragment>No Account to be found :'(</React.Fragment>;
	}

	async getAccountDetails(){
		let userName = await Fetch.getUser(this.props.person);
		console.log(userName);
		console.log(typeof userName);
		return userName[0]; 
	}

}

export default AccountLB;
