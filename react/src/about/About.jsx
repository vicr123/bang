import React from "react";
import Error from "../Error";

import "./about.css";

class About extends Error {
  render() {
    return (
      <div className="container">
        <h1>Image Only Fun</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci,
          aliquam inventore. Alias id dolorum explicabo. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Ipsa repellendus deserunt, esse
          nostrum quasi sunt. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Consectetur voluptatibus ratione ducimus
          perferendis. Illo nesciunt voluptas sapiente, eaque praesentium
          aperiam.
        </p>
        <div className="Rules">
          <h2>Global Rules</h2>
          <ol>
            <li>All posts are images ONLY</li>
            <li>Reactions are images ONLY</li>
            <li>Attempts to post text are NOT permitted</li>
            <li>Posting of illegal content is NOT permitted</li>
            <li>Impersonating a moderator is strictly prohibited</li>
            <li>Advertising is NOT permitted</li>
            <li>No spamming is allowed</li>
          </ol>
        </div>
        <hr />
        <div className="ContactUs">
          <h1>Contact Us</h1>
          <button>Email</button>
        </div>
      </div>
    );
  }
}

export default About;
