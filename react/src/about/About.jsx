import React from "react";
import Error from "../Error";

class About extends Error {
  render() {
    return (
      <div className="scrollable" style={{flexGrow: 1}} >
        <div className="padded">
          <h1>Image Only Fun</h1>
          <p>
            Welcome to !BANG, we hope you enjoy your stay.
            !BANG is an image sharing site only. You will not be able to post any text on this site, just them sweet pics.
          </p>
        </div>
        <div className="HorizontalBox padded">
          <h2>Global Rules</h2>
          <ol>
            <li>All posts are images ONLY</li>
            <li>Attempts to post text are NOT permitted</li>
            <li>Posting of illegal content is NOT permitted</li>
            <li>Impersonating a moderator is strictly prohibited</li>
            <li>Advertising is NOT permitted</li>
            <li>No spamming is allowed</li>
          </ol>
        </div>
        <div className="ContactUs padded">
          <h1>Contact Us</h1>
          <button onClick={() => window.location = "mailto:hello@vicr123.com"}>Email</button>
        </div>
      </div>
    );
  }
}

export default About;
