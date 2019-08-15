import React from 'react';
import Component from './Component';
import './App.css';

import Sidebar from './Sidebar';
import TrendingView from './posts/TrendingView';

class App extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <div className="appContainer">
            <Sidebar />
            <TrendingView />
        </div>
    }
}

export default App;
