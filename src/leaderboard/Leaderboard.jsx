import React from 'react';
import Component from '../Component'

// Displays the top accounts on the site 
class Leaderboard extends Component {


  // Placeholder divs will have to be replaced with components for user/account summaries 
  render(){
    return (
      <div>
        <h1>THIS WILL DISPLAY THE TOP USERS OF THE SITE BASED ON A SPECIFIC METRIC AND TIME FRAME</h1>
        <div>PlaceHolder USER #1</div>
        <div>PlaceHolder USER #2</div>
        <div>PlaceHolder USER #3</div>
        <div>...</div>
        <div>PlaceHolder USER #N</div>
      </div>
      ); 
  }
}

export default Leaderboard;