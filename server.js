import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/weeklyMealPlanner";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose models
const Recipe = new mongoose.model('Recipe', {
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
    type: Array,
  }
});

// const Ingredients = new mongoose.model('Ingredients', {
//   name: {
//     type: String,
//     required: true,
//   }
// });

// Populate/Seed database 
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Recipe.deleteMany({});
    await Ingredients.deleteMany({});

    recipes.forEach(recipe => {
      new Recipe(recipe).save();
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
  try {
    const recipes = await Recipe.find(req.query);
    if (recipes) {
      return res.status(200).json(recipes);
    } else {
      // Error handling
      res.status(404).json({ error: 'Data not found' })
    }
  } catch (err) {
    res.status(400).json(error);
  }
});

// Endpoint to see that particular meal - GET request
app.get('/recipes/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const recipe = await Recipe.findOne({ _id: _id });
    if (recipe) {
      res.json(recipe);
    } else {
      // Error handling
      res.status(404).json({ error: 'Recipe not found.' })
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// // Endpoint to see all ingredients - GET request
// app.get('/ingredients', async (req, res) => {
//   try {
//     const ingredients = await Ingredients.find(req.query).sort({ ingredients: 'asc' });
//     if (ingredients) {
//       res.json(ingredients);
//     } else {
//       // Error handling
//       res.status(404).json({ error: 'Ingredients not found' });
//     }
//   } catch (err) {
//     res.status(400).json(error);
//   }
// });

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
});
