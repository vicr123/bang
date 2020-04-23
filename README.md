# !BANG

Welcome to !BANG, home of the best image-only fun you can find.<br>
<br>
Bang was created by Victor Tran, Ethan Scavia and Michael Noss as part of an assignment for Advanced Internet Programming at UTS. It is a simple, image-only social media site.<br>
<br>
It is our baby and we hope you enjoy it as much as we do.<br>
<br>
!BANG is currently available at https://bang.vicr123.com/

## Available Scripts

In the project directory, you can run:

### `start.sh`

Runs the server on port 3000. Also uses other sh files. Bootstrap does not work on Windows, so use bootstrap.sh<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Available commands are documented when you start the app.

### `start_express.sh`

Starts Express.

### `bootstrap.sh`

Installs required dependencies.

### `flags.sh`

Allows admins to view and respond to flags that users have created. The server must be running and you must input the port that the server is running on.

## `Design Points`

- Braces on same line.
- 4 space indentaion. No tabs.
- Keep stylesheets simple. All CSS must be in App.css unless it is more simple to inclide it in other sheets.
- Include a simple comment before each method so it is easy to understand how they work. If necessary, include comments in the method as well.
- Declare all new variables on a separate line.
- Use whitespace to shelp readability. For example, separate methods from each other and to separate keywords from braces.
- Do not store images directly in the database (this is a cardinal sin of databases and must never be done, even if it is possible).
- Ensure a good user experience for slow connections (e.g. loading screens, chaching, async and await functions).
- Create wrappers for FETCH and SQLite to ease implementation of these features in frontend.
- Ensure modularity and reduce code redundancy by breaking down into components
- Everything needed to interact with different pages must be visible at all times.
- Minimal curves in design. Maintain a geometric design with sharp corners across all pages to maintain design consistency.
- Use of colour only to highlight elements of the page that are interactive so the user is not distracted by elements (focus is on viewing the image)
- Ensure that mobile users have a good user experience.
- Follow the rule of thirds, prioritising the image viewing space as much as possible.


