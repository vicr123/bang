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
import Fetch from "./fetch";
import LoginHandler from "./LoginHandler";

import DeadImage from "./assets/dead.svg"

class App extends Error {
	urlStates = {
		createPost: "/createpost",
		leaderboard: "/leaderboard",
		about: "/about",
		user: "/me",
		new: "/new",
		trending: "/"
	};

	constructor(props) {
		super(props);

		window.bang = {};
		window.bang.appState = () => this.state;
		window.bang.appLoginChangedHandler = () => this.loginChanged.bind(this);

		this.state = {
			currentView: this.stateForCurrentUrl(),
            error: false
		};

		//Log the user in if we have a token stored
        LoginHandler.reloadLogin();
        LoginHandler.on("loginDetailsChanged", Fetch.invalidate);
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

	/**
	 * Gets the view required depending on the state
	 * @returns {import('@babel/types').JSXElement} The element to render in the main view
	 */
	currentMainView() {
		switch (this.state.currentView) {
			case "createPost":
				return <CreatePost onShowAboutPage={() => this.setState({
					currentView: "about"
				})}/>;
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
					<Account />
				);
			default:
				return <Error />;
		}
	}

	pushView(view) {
		window.history.pushState({}, "", this.urlStates[view]);
	}

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
        this.setState({
            error: true
        });
    }

	render() {
		let changeView = view => {
			this.setState({
				currentView: view
			});

			this.pushView(view);
		};

        if (this.state.error) {
            return <div className="scrollable postError" style={{height: '100vh'}}>
                <img src={DeadImage} />
                Ouch, that hurt!
                <button onClick={() => window.location.reload()}>Reload</button>
            </div>
        } else {
    		return (
                <div className="appContainer">
    				<Sidebar
    					currentState={this.state.currentView}
    					onChangeView={changeView}
    				/>
    				{this.currentMainView()}
    				<div id="modalContainer" />
                    <div id="loaderContainer" />
    			</div>
    		);
        }
	}
}

export default App;
