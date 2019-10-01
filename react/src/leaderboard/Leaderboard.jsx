import React from "react";
import Error from "../Error";
import Fetch from '../fetch';

// Displays the top accounts on the site
class Leaderboard extends Error {

	constructor(props){
		super(props);

		this.state = {
			leaders: []
		};

		this.getLeaders().then((leaders) => {
			this.setState({
				leaders: leaders
			});
		});
	}

	render() {
		return (
			<div className="scrollable padded">
				<h1>
					Leaderboard
				</h1>
				<div>
					{this.mapLeaders()}
				</div>
			</div>
		);
	}

	async getLeaders(){
		let result = await Fetch.get("/leaderboard");
		console.log(result);
		console.log(typeof result);
		return result;
	}

	mapLeaders(){
		return this.state.leaders.map(person => {
			return <AccountLB person = {person}/>
		});
	}
}

export default Leaderboard;
