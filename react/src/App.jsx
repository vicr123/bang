import React from 'react';
import Error from './Error';
import './App.css';

import Sidebar from './Sidebar';
import TrendingView from './posts/TrendingView';
import Leaderboard from './leaderboard/Leaderboard';
import About from './about/About';
import Account from './account/Account';

class App extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentView: "trending",
            login: {}
        };
        
        //Log the user in if we have a token stored
        this.loginChanged();
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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token
                }
            }).then((response) => {
                if (!response.ok) throw new Error()
                return response.json();
            }).then((json) => {
                this.setState({
                    login: {
                        "username": json.username
                    }
                });
            }).catch(function() {
                localStorage.removeItem("loginToken");
                
                //TODO: Inform the user that we couldn't log them back in
                
                this.setState({
                    login: {}
                });
            })
        }
    }
    
    /**
     * Gets the view required depending on the state
     * @returns {import('@babel/types').JSXElement} The element to render in the main view
     */
    currentMainView() {
        switch (this.state.currentView) {
            case "trending":
                return <TrendingView />;
            case "leaderboard":
                return <Leaderboard />;
            case "about":
                return <About />;
            case "user":
                return <Account currentLogin={this.state.login} onLoginChanged={this.loginChanged.bind(this)} />;
            default:
                return <Error />;
        }
    }
    
    render() {
        let changeView = (view) => {
            this.setState({
                currentView: view
            });
        };
        
        return <div className="appContainer">
            <Sidebar currentState={this.state.currentView} onChangeView={changeView} currentLogin={this.state.login}/>
            {this.currentMainView()}
        </div>
    }
}

export default App;
