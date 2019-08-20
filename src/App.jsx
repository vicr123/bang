import React from 'react';
import Component from './Component';
import './App.css';

import Sidebar from './Sidebar';
import TrendingView from './posts/TrendingView';
import Leaderboard from './leaderboard/Leaderboard';

class App extends Component {
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
            default:
                return <Component />
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
