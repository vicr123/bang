import React from 'react';
import Component from './Component';
import './App.css';

import Sidebar from './Sidebar';
import TrendingView from './posts/TrendingView';

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentView: "trending"
        };
    }
    
    currentMainView() {
        switch (this.state.currentView) {
            case "trending":
                return <TrendingView />;
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
