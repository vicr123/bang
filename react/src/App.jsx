import React from "react";
import Error from "./Error";
import "./App.css";

import Sidebar from "./Sidebar";
import TrendingView from "./posts/TrendingView";
import NewView from "./posts/NewView";
import Leaderboard from "./leaderboard/Leaderboard";
import About from "./about/About";
import Account from "./account/Account";
import CreatePost from "./create-post/CreatePost";

class App extends Error {
	urlStates = {
		createPost: "/createpost",
		leaderboard: "/leaderboard",
		about: "/about",
		user: "/me",
		trending: "/",
		new: "/new"
	};

	constructor(props) {
		super(props);

		this.state = {
			currentView: this.stateForCurrentUrl(),
			login: {}
		};

		//Log the user in if we have a token stored
		this.loginChanged();
	}

	componentDidMount() {
		window.addEventListener("popstate", this.popState.bind(this));
	}

	stateForCurrentUrl() {
		for (let [key, value] of Object.entries(this.urlStates)) {
			if (document.location.pathname.startsWith(value)) {
				return key;
			}
		}
	}

	popState(e) {
		let state = this.stateForCurrentUrl();
		if (state != null)
			this.setState({
				currentView: state
			});
	}

	loginChanged() {
		let token = localStorage.getItem("loginToken");
		if (token == null) {
			this.setState({
				login: {}
			});
		} else {
			//Get the current username
			fetch("/api/users/whoami", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + token
				}
			})
				.then(response => {
					if (!response.ok) throw new Error();
					return response.json();
				})
				.then(json => {
					this.setState({
						login: {
							username: json.username
						}
					});
				})
				.catch(function() {
					localStorage.removeItem("loginToken");

					//TODO: Inform the user that we couldn't log them back in

					this.setState({
						login: {}
					});
				});
		}
	}

	/**
	 * Gets the view required depending on the state
	 * @returns {import('@babel/types').JSXElement} The element to render in the main view
	 */
	currentMainView() {
		switch (this.state.currentView) {
			case "createPost":
				return <CreatePost />;
			case "trending":
				return <TrendingView type="trending" />;
			case "new":
				return <TrendingView type="new" />;
			case "leaderboard":
				return <Leaderboard />;
			case "about":
				return <About />;
			case "user":
				return (
					<Account
						currentLogin={this.state.login}
						onLoginChanged={this.loginChanged.bind(this)}
					/>
				);
			default:
				return <Error />;
		}
	}

	pushView(view) {
		window.history.pushState({}, "", this.urlStates[view]);
	}

	render() {
		let changeView = view => {
			this.setState({
				currentView: view
			});

			this.pushView(view);
		};

		return (
            <div className="appContainer">
                <div id="loaderContainer">
    		    </div>
				<div id="modalContainer" />
				<Sidebar
					currentState={this.state.currentView}
					onChangeView={changeView}
					currentLogin={this.state.login}
				/>
				{this.currentMainView()}
			</div>
		);
	}
}

export default App;
