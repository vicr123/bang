/**
 * This file is adapted from a codepen by jczimm located here:
 * https://codepen.io/jczimm/pen/vEBpoL
 */

import React from 'react';
import './Spinner.css';

class Spinner extends React.Component {
    render() {
        return <div class="spinner">
            <svg class="circular" viewBox="25 25 50 50">
                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
            </svg>
        </div>
    }
}

export default Spinner;