import React from "react";
import Error from "../Error";
import Fetch from '../fetch';
import AccountLB from './AccountLB';

// Displays the top accounts on the site
class Leaderboard extends Error {

	constructor(props){
		super(props);

		this.state = {
			leaders: []
		};
	}

	componentWillMount() {
		this.getLeaders().then((leaders) => {
			this.setState({
				leaders: leaders
			});
		});
	}

	render() {
		return (
			<div className="scrollable padded LBBoxContainer">
				<h1>
					Leaderboard
				</h1>
				<div>
					{this.mapLeaders()}
				</div>
			</div>
		);
	}

	// Returns top users based on reactions
	async getLeaders(){
		let result = await Fetch.get("/leaderboard", false);
		return result;
	}

	// map each id to an AccountLB for render
	mapLeaders(){
		return this.state.leaders.map(person => {
			return <AccountLB person = {person}/>
		});
	}
}

export default Leaderboard;
