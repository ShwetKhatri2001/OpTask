# OpTask

![OpTask Logo](/frontend/src/Images/OpTask.png)

By [Shwet Khatri](https://github.com/ShwetKhatri2001) 

My project is a project management site where users can create new projects, add tasks, and update their progress as the work. You can find live site [here](http://optasks.herokuapp.com/). 

## Screenshots

![Landing Page](/frontend/src/Images/landing.png)

![Dashboard](/frontend/src/Images/dashboard.png)

![Profile Page](/frontend/src/Images/profile.png)

![Sign Up Page](/frontend/src/Images/register.png)

![Login Page](/frontend/src/Images/login.png)

## How to Start

Download or clone this repository. Then in both the OpTask folder and frontend folder use:

```
npm install
```

in order to download the dev tools and packages used in this application. We used Prettier to format this code and the project was linted with ESLint.
In order to get the MongoDB working, create a ".env" file in your project folder. Create variables in the .env file called MONGO_URL and SESSION_SECRET and set it equal to your Mongo connection string and secret phrase respectively. To run this program open up terminal to the main folder and another terminal window then cd frontend.
In main use:

```
npm test
```

In frontend use:

```
npm start
```

## Folders

- auth: contaiins Passport.js set up/config files
- db: contains a js file that connects the functionality established in the routes to respective collections in MongoDB
- frontend: contains all frontend material
  - public: houses index.js
  - src: contains javascripts and corresponding stylesheets used to build the site pages (organized by page/component)
- routes: contains the js files that run the express routing

## Licensing

> You can check out the full license [here](/LICENSE)

This project is licensed under the terms of the **MIT** license.
