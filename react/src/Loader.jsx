import React from "react";
import ReactDOM from 'react-dom';
import Error from "./Error";
import Spinner from "./Spinner";

// Used to process loader requests when the user scrolls down a list to see more posts. Calls spinner when doing this.
class Loader extends Error {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <div className="loader">
            <Spinner />
        </div>
    }
    
    static mount() {
        if (Loader.count == 0) {
             ReactDOM.render(<Loader />, document.getElementById('loaderContainer'));
        }
        Loader.count++;
        
    }
    
    static unmount() {
        Loader.count--;
        if (Loader.count == 0) {
             ReactDOM.render(null, document.getElementById('loaderContainer'));
        }
    }
}
Loader.count = 0;

export default Loader;