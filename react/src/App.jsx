import React from 'react';
import Error from './Error';
import './App.css';

import Sidebar from './Sidebar';
import TrendingView from './posts/TrendingView';
import Leaderboard from './leaderboard/Leaderboard';

class App extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentView: "trending"
        };
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
                return <Leaderboard /> 
            case "about":
                return <div className="padded">
                    !Bang v0.1
                </div>;
            default:
                return <Error />
        }
    }
    
    render() {
        let changeView = (view) => {
            this.setState({
                currentView: view
            });
        };
        
        return <div className="appContainer">
            <Sidebar currentState={this.state.currentView} onChangeView={changeView} />
            {this.currentMainView()}
        </div>
    }
}

export default App;
