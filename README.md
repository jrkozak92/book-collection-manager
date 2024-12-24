# Books Collection Manager
## Setup
This project requires the ```psql``` terminal utility, that you have PostgreSQL installed on your system, the ```npm``` terminal utility, Node.js (tested on v20+), and a recent version of Google Chrome as your browser. It has not been tested outside of these conditions.

### Getting Started
Clone this public repo to a location on your system by running 
```
git clone git@github.com:jrkozak92/book-collection-manager.git
```
in the desired parent directory.

Once cloned, 
```
cd book-collection-manager
npm install
```

#### Database Setup
From the project root directory run 
```
psql -f handleSQL.sql
```
in your terminal to create the necessary tables in PostgreSQL. You may need to modify this command if you have security around your local psql tool, there are plenty of resources available with a quick Google to work around this.

#### Environment Variables
The project requires a set of environemnt variables located in a ```.env``` file on the root directory.

Variable names (and values if provided) must match the following exactly:
```
SQL_USER=
SQL_HOST=
SQL_DBPORT=
SQL_DATABASE=books
MONGO_URL=
SECRET=
```

The SQL values are whatever your PostgreSQL instance expects for a local integration. Mine are my username, localhost, and 5432 (the default port PostgreSQL uses).

The Mongo URL to my development database will be provided in the email. I've spun up an Atlas Cloud instance for this project. You are free to create your own Mongo DB instance, simply provide the connection string for the ODM in the MONGO_URL variable here, if so.

#### Start and Open the App
Back in Terminal at the project root, run ```nodemon server.js``` or ```npm start```, whichever you prefer.

Open Google Chrome and navigate to ```http://localhost:3000```.

The site should load and be interactive. You will be required to create an account via the Register button in the top right before you can start using most of the functionality. 

## Approach and Lessons Learned
### How'd it Go?
Not great.

Having never used Handlebars before, I spent some time getting familiar with the tool, which given the state of the documentation and the various helper libraries surrounding modern implementations of it, was much more convoluted than I expected.

After getting a basic handle on Handlebars, I began forming some simple templates and paritals, which came together fairly quickly. I then started working on the SQL integration and login/auth flow, which went pretty well until I got to the point of attempting to integrate sessions.

I have used the ```express-sessions``` library in the past, and figured it would be an easy integration. Boy, was I wrong. A single setting's wild goose chase delayed me at least a full day, but I did eventually figure it out. 

Once logins were functional, I transitioned into more Handlebars work. I started in a very 'Reacty' mindset, focusing on semantic HTML implementation and expecting a lot of client side rendering updates, but the only way I could achieve them was through direct DOM manipulation, which seemed like it was not the intended way to interact with the library. After some trial and error, and a frustratingly poorly detailed deep dive into how Handlebars is meant to be used, I realized I was coming at it from the wrong direction, and should default to old-school SSR style interaction.

That decision immediately opened the doors to let the features flow. The collections and books integrations came quickly, along with the MongoDB integration to store and manage the Books data.

The search functionality proved trickier than I expected. I recently built a pretty fancy search implementation with React for a work project, but Handlebars/SSR logic is obviously very different. The search is still a bit wonky, but if you play with it, you can figure out what works.

My intention was to have the search list that appears when you select a collection or enter text into the search bar filter down all possible options and show them as a list, and have those list items be clickable to auto-scoll you to that book instance on click. This would keep the search and filter functionality modular and not require the production of a separate view route for individual books (not included in the project spec, and frankly, I had already spent much too much time on the project). I don't think this is currently working, but it's well past time to deliver, so here we are.

After some quick pure CSS styling, here we are. It's far from perfect, but it mostly works. I'm not happy with it, but I know I could have crushed it with React, so I'll call it a learning exercise and some good practice in cross-database integrations.

### Lessons Learned
- Don't try to force CSR into an SSR tool
- Quick and dirty is better than slow and okay for stuff like this
- Handlebars is a much simpler tool than I tried to make it, which threw me off more than anything else.
- It's okay to move onto other functionality if something unneccesary is still broken. Don't get stuck bug hunting on stuff that isn't core functionality.

### What I'd do differently
- Treat it like a very basic RESTful example app with any standard templating language, managing (almost) all view updates with proper MVC proceedure instead of DOM manipulation
- NOT worry about actually getting proper persisent sessions working. That was the biggest time-suck and likely fully out of scope for this project
- Set a hard time limit and deliver within that timeframe instead of letting my standards delay delivery, especially when working with a tool I'm unfamiliar with
 
# Thank you for your time and consideration.
I'm happy to discuss what went right and wrong here further. I still don't consider this a good showing of what I can do, but I am very out of practice with this kind of frontend work, so it was a good practice, refresher, and learning opportunity, if nothing else.

I look forward to talking soon.