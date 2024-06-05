// Here is where we import modules

const dotenv = require("dotenv"); // require .env package
dotenv.config(); // loads the environment variables from .env file
// it’s important that these two lines of code are at the top of this file - it ensures that the environment variables are available everywhere across your application.

// We begin by loading Express
const express = require("express"); // require express package
const mongoose = require("mongoose"); // require mongoose package
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); // new
const path = require("path"); // require path to use public/stylesheets/style.css

const app = express();

// connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// This is a Mongoose event listener that runs the supplied callback function once we have connected to a database. In the callback function, we log the name of the database to which we’ve connected - in this case, it should be fruits.
// in terminal running nodemon, you should now see two messages of connection with port 3000 and connected to mongoose




// import the newly created fruit model
const Fruit = require("./models/fruit.js");
// With this addition, we’re ready to use our Fruit model in the request handling functions defined in our express routes. This setup will allow us to perform database operations like creating, reading, updating, and deleting fruit documents in MongoDB.




// This middleware parses incoming request bodies, extracting form data and converting it into a JavaScript object. It then attaches this object to the req.body property of the request, making the form data easily accessible within our route handlers.
// this should be after the imported Fruit model (line 23)
app.use(express.urlencoded({ extended: false }));
// this is created after we made the submit form for new foods and before defining the post route
app.use(methodOverride("_method")); // this allows us to add a query parameter to our DELETE & PUT button action URL and tricks our server into treating the POST request as a delete/put request
app.use(morgan("dev")); // If at any point, you feel your terminal is getting crowded with additional information you don’t need, simply comment this out

app.use(express.static(path.join(__dirname, "public"))); // allows us to serve static files from the directory




// build the route and create a landing page
app.get("/", async (req, res) => {
  res.render("index.ejs"); // init it was res.send("hello, friend!") to test
});






// index route
// Now that we have created a way for users to add fruits to our database, the next step is to display these fruits. In this section, we will develop the Index Route. This route will retrieve and display all the fruits currently stored in our database.

// In keeping with RESTful routing conventions, the url for this route will be: /fruits
// Retrieve all fruit data
// Now that we know our route is set up, our next step is to retrieve data from the database. In this case, we are looking for all of the fruits. To accomplish this, we’ll use Mongoose’s .find() method. When called without any arguments, .find() retrieves all documents within a collection, returning them as an array. line 75

// This route will retrieve and display all the fruits currently stored in our database. add beneath the landing page and above the /fruit/new route

// test that our new route is set up:
// app.get("/fruits", (req, res) => {
//     res.send("Welcome to the index page!");
//   });

// retrieve data from the database. In this case, we are looking for all of the fruits. To accomplish this, we’ll use Mongoose’s .find() method. When called without any arguments, .find() retrieves all documents within a collection, returning them as an array.
// modify our route to be an asynchronous function. This allows us to use the await keyword to wait for .find() to complete its operation and assign the result to the allFruits variable.
// To be sure we have the data we are looking for, let’s log allFruits to the console:

// app.get('/fruits', async (req, res) => {
// const allFruits = await Fruit.find();
// console.log(allFruits); logs all the fruits in the terminal
//     res.send('Welcome to the index page!')
// })

// Instead of .send(), we will use .render() to respond with a dynamically generated HTML view. The .render() method takes two arguments:

// The first argument is a string specifying the path to the EJS template we wish to render. In our case, it’s ‘fruits/index.ejs’.

// The second argument is an object containing the data we want to pass to the template. This data is provided as key/value pairs, where the key is the name we’ll use to reference the data in our EJS template. By passing { fruits: allFruits }, we made the allFruits array accessible in our EJS file as a variable named fruits

// We’ll pass the allFruits data to our template under the key fruits. This way, our EJS template can use fruits to access and display the data:
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  res.render("fruits/index.ejs", { fruits: allFruits });
  // now i can access the the fruits through this fruits key in index.ejs
  // console.log(allFruits); // this logs all data that was posted to the terminal to test
  // res.send("Welcome to the index page!"); only to test route
  // The second argument is an object containing the data we want to pass to the template. This data is provided as key/value pairs, where the key is the name we’ll use to reference the data in our EJS template.
  // By passing { fruits: allFruits }, we made the allFruits array accessible in our EJS file as a variable named fruits
});







// Define the route
// In keeping with RESTful routing conventions, the url for this route will be: /fruits/new
// beneath the landing page route and above the app.listen() method (remember, all routes should be defined above app.listen()
app.get("/fruits/new", (req, res) => {
  // route to get the form on new.ejs
  res.render("fruits/new.ejs");
});










// Now, that the fruit id is a clickable link, Let’s define and test our show route.
// adding new route to fruit link using id. needs to go below the other fruit routes The order in which routes are placed in an express server is important, as Express evaluates them top-to-bottom. This means the placement of routes can affect how your application responds to specific URLs.
// The issue arises because Express matches routes in the order they are defined. The URL /fruits/new is mistakenly caught by the /fruits/:fruitId route. In this route, :fruitId acts as a placeholder and accepts any string, including “new”. So, Express thinks “new” is a fruit ID and stops looking for further route matches.

// app.get("/fruits/:fruitId", (req, res) => {
//     res.send(
//       `This route renders the show page for fruit id: ${req.params.fruitId}!`
//     );
//   });
// You should see your message along with our fruitId route parameter.

// Build the read functionality
// We’ll use Mongoose’s .findById() method for fetching a specific fruit by its _id. This method is perfect for retrieving a single document based on its unique identifier.

// Update the route with the following:

// app.get("/fruits/:fruitId", async (req, res) => {
//   const foundFruit = await Fruit.findById(req.params.fruitId);
//   res.send(`This route renders the show page for fruit id: ${req.params.fruitId}!`);
// });
// In the above code, req.params.fruitId captures the ID from the URL, and we use it to find the specific fruit. We’ve also made the function async so that we can await the asynchronous database operation.







// Rendering the Fruit details
// After fetching the fruit, we’ll update from res.send() to res.render() to display the show page template. We’ll also pass the retrieved fruit data to the template:

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});
// now we can create the show.ejs template inside the views/fruits






// Because this route URL has three parts, it does not conflict with others and can be placed anywhere among our other routes.
// making edit route
// GET localhost:3000/fruits/:fruitId/edit
// GET localhost:3000/fruits/:fruitId/edit
// app.get("/fruits/:fruitId/edit", async (req, res) => {
//   const foundFruit = await Fruit.findById(req.params.fruitId);
//   console.log(foundFruit);
//   res.send(`This is the edit route for ${foundFruit.name}`);
// });
// Like our show route, we’ll use Fruit.findById(req.params.fruitId) to find the specific fruit in our database. The req.params.fruitId captures the ID from the URL.
// Since finding a fruit is an asynchronous operation, we use async before our route callback function and await before the findById method. This ensures that the server waits for the fruit to be found before moving to the next line of code.
// Test the route by clicking the “Edit” link on the show page of a particular fruit. Check your terminal to make sure you see the data for the fruit that you intend to edit.
// Lastly, let’s modify our route so that it renders views/fruits/edit.ejs, passing in the foundFruit variable we created above:

app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});




// define the post route
// Let’s start by defining and testing our route. Add the following code to server.js, beneath the new route:
// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  // in the code snippet above, we have to do a little bit of data manipulation before our new fruit is ready to be sent to the database. The if statement checks the value of req.body.isReadyToEat. This field comes from a checkbox in our form. In web forms, a checked checkbox sends the value "on", while an unchecked checkbox sends no value (thus, it’s undefined). We convert this “on” or undefined value to a Boolean (true or false) to match our schema’s expected data type for isReadyToEat.

  // req.body.isReadyToEat = !!req.body.isReadyToEat; this is clever way to rewrite the above if else. the double negative !! converts it to a boolean value
  // req.body.isReadyToEat = req.body.isReadyToEat ? true : false using ternary

  // console.log(req.body);
  await Fruit.create(req.body); // add to database collection on mongodb
  // we use Fruit.create(req.body) to add a new fruit to our database. req.body contains the form data sent by the user, which now includes our corrected isReadyToEat value. Fruit.create() is an asynchronous operation; we use await to ensure the database operation completes before the function continues.
  //   res.redirect("/fruits/new"); first old redirect
  res.redirect("/fruits"); // once data is added then it redirects back to form,then we changed and redirected to index fruits to see the new changes and submissions
  //   Next, we use Fruit.create(req.body) to add a new fruit to our database. req.body contains the form data sent by the user, which now includes our corrected isReadyToEat value. Fruit.create() is an asynchronous operation; we use await to ensure the database operation completes before the function continues.

  // Finally, we redirect the user back to the form page using res.redirect("/fruits/new"). This is a common practice after processing form data to prevent users from accidentally submitting the form multiple times by refreshing the page.
  // can verify if data was saved by navigating to mongoDB
});

//   In the browser, enter some data and submit the form on the /fruits/new page. You’ll instantly be redirected back to /fruits/new, but if you check your terminal, you should see a JS object representation of the form data you just submitted.

// Now that we’ve confirmed our form submits data to the POST route, let’s add the logic to create a fruit in our database: lines 184-187







// The update route
// To allow users to update a fruit’s details, we need to set up an update route. This route will handle PUT requests sent from the edit form on the Edit page. The URL pattern for this route is /fruits/:fruitId, where :fruitId represents the unique identifier of the fruit being updated.

// Like the create route, the update route requires special data handling for the isReadyToEat property. This property, being a checkbox in our form, sends different values based on whether it’s checked or not, and we need to handle this in our route to ensure it aligns with our database schema.

// The update route is unique as it specifically deals with PUT requests. Since it does not conflict with other routes, its placement within server.js can be flexible. However, it should be positioned after any middleware and before the app.listen() function.

// In this route, we will employ the Mongoose findByIdAndUpdate() method. This method allows us to update a specific document in the MongoDB database based on its unique ID. Since this is an asynchronous operation, we’ll utilize async/await to ensure the operation completes before proceeding.

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});


// The delete route
// The purpose of this route is to remove a specific fruit from the database. If we follow RESTful routing conventions, we know our route will be DELETE /fruits/:fruitId, with fruitId referring to the id of the fruit we intend to delete.
// This route uses app.delete to listen for delete requests. When a delete request is made to /fruits/:fruitId, it will respond with a message saying “This is the delete route”. This step ensures that the delete route is being accessed correctly when the delete button is clicked.

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits"); // After deleting the fruit, we will redirects the user back to the index page /fruits, where the deleted fruit will no longer be listed.
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
