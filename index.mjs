import express from 'express';
import mysql from 'mysql2/promise';


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
    host: "z12itfj4c1vgopf8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "uro6cznr04eygyhx",
    password: "oa8kjjl7zrnapey9",
    database: "go7x7xs242lpoe9s",
    connectionLimit: 10,
    waitForConnections: true
});

let apikey = "6f8b3e56f54942c0a5d71e4c1c7cee26" 

//routes
app.get('/', async (req, res) => {
    res.render('home');
});

app.get('/searchByName', async (req, res) => {
    let query = req.query.search;
    console.log(query);
    let spoonResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=4&apiKey=${apikey}`);
    let spoonData = await spoonResponse.json();
    console.log(spoonData);
    res.render('results', { data: spoonData.results });
});

app.get('/searchByIngredients', async (req, res) => {
    let ingredients = req.query.ingredients;
    console.log(ingredients);
    let spoonResponse = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=4&ignorePantry=true&apiKey=${apikey}`);
    let spoonData = await spoonResponse.json();
    console.log(spoonData);
    res.render('results', { data: spoonData });
});

app.get('/recipe/:id', async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let spoonResponse = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apikey}`);
    let spoonData = await spoonResponse.json();
    console.log(spoonData);
    res.render('recipe', { recipe: spoonData });
});

app.get('/api/random-recipe', async (req, res) => {
    try {
        let spoonResponse = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apikey}`);
        let spoonData = await spoonResponse.json();
        res.json(spoonData);
    } catch (err) {
        console.error("API error:", err);
        res.status(500).json({ error: "Failed to fetch random recipe" });
    }
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get('/randomRecipe', (req, res) => {
    res.render('randomRecipe');
});

app.listen(3000, () => {
    console.log("Express server running")
})