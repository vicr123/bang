import React from 'react';
import Error from '../Error'

// Displays the top accounts on the site 
class Leaderboard extends Error {


  // Placeholder divs will have to be replaced with components for user/account summaries 
  render(){
    return (
      <div className="scrollable">
        <h1>THIS WILL DISPLAY THE TOP USERS OF THE SITE BASED ON A SPECIFIC METRIC AND TIME FRAME</h1>
        <div className="userPlaceholder">PlaceHolder USER #1</div>
        <div className="userPlaceholder">PlaceHolder USER #2</div>
        <div className="userPlaceholder">PlaceHolder USER #3</div>
        <div className="userPlaceholder">...</div>
        <div className="userPlaceholder">PlaceHolder USER #N</div>
      </div>
      ); 
  }
}

export default Leaderboard;