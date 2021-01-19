import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/weeklyMealPlanner";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose models
const Recipe = mongoose.model('Recipe', {
  meal: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredients'
  }
});

const Ingredients = mongoose.model('Ingredients', {
  ingredients: {
    type: String,
    required: true,
  }
});

// Populate/Seed database 
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Recipe.deleteMany({});
    await Ingredients.deleteMany({});

    recipes.filter(recipe => recipe.ingredients === ingredients.ingredients).forEach(async (recipe) => {
      new Recipe({}).save();
    });
  }
  seedDatabase();
}

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// API ENDPOINTS
// To list all the endpoints in the first view
const listEndpoints = require('express-list-endpoints');
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// Endpoint to add new recipes - POST request
app.post('/recipes', async (req, res) => {
  try {
    const { meal, description, ingredients } = req.body;
    const newRecipe = await new Recipe({ meal, description, ingredients }).save();
    res.status(200).json(newRecipe);
  } catch (err) {
    res.status(404).json(err)
  }
});

// Endpoint to see the list with all recipes - GET request
app.get('/recipes', async (req, res) => {
  const recipes = await new Recipe;
  res.status(200).json(recipes);
});

// Endpoint to see all ingredients - GET request


// Middleware to handle server connection errors
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could not access the server.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
