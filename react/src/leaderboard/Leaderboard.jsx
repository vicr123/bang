import React from "react";
import Error from "../Error";
import Fetch from '../fetch';

// Displays the top accounts on the site
class Leaderboard extends Error {

	render() {
		return (
			<div className="scrollable">
				<h1>
					Leaderboard
				</h1>
				
			</div>
		);
	}

	getLeaders(){
		// Fetch.get("")
	}
}

export default Leaderboard;
