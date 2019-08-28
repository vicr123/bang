import React from 'react';
import Error from '../Error'

class About extends Error {
    render(){
        return(
            <div className="scrollable">
                <p>!Bang v0.1</p>
            </div>
        );
    }
}

export default About;