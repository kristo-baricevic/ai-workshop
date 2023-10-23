const { Configuration, OpenAIApi } = require("openai");



const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();


app.use(express.json()); // parse JSON requests
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/chat', async (req, res) => {
  const body = req.body;
  const response = await fetch("https://api.openai.com/v1/chat/completions",
    {
        method: 'POST',
        temperature: 0,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(data)
    })

    const json = await response.json();
    res.json(await response.json());
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/general', async (req, res) => {
  const body = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: body.prompt }],
  });

  res.json(completion.data.choices[0].message.content);
});

app.post('/api/image', async (req, res) => {
  const body = req.body;

  const response = await openai.createImage({
    prompt: body.prompt,
    n: 1,
    size: "512x512",
  });
  res.json({url: response.data.data[0].url});
})

const recipeSample = {
    "name": "Vegetarian Pho",
    "slug": "vegetarian-pho",
    "image": "images/original/vegetarian-pho.png",
    "type": "Main Meal",
    "duration": 90,
    "description": "A flavorful and comforting vegetarian pho made with a rich, aromatic broth and loaded with veggies, rice noodles, and fresh herbs.",
    "ingredients": {
        "Vegetable oil": "1 tablespoon",
        "Onion": "1, halved",
        "Ginger": "4-inch piece, unpeeled",
        "Vegetable broth": "8 cups",
        "Star anise": "3",
        "Cinnamon stick": "1",
        "Cardamom pods": "3",
        "Cloves": "5",
        "Coriander seeds": "1 tablespoon",
        "Soy sauce": "3 tablespoons",
        "Brown sugar": "1 tablespoon",
        "Rice noodles": "8 ounces",
        "Assorted vegetables": "3 cups, e.g., mushrooms, bok choy, broccoli, carrots",
        "Lime": "1",
        "Bean sprouts": "1 cup",
        "Fresh basil": "1 cup",
        "Fresh mint": "1 cup",
        "Fresh cilantro": "1 cup",
        "Green onions": "2, thinly sliced",
        "Jalapeno": "1, thinly sliced",
        "Sriracha": "to taste",
        "Hoisin sauce": "to taste"
    },
    "steps": [
        {
            "name": "Char Onion and Ginger",
            "description": "Heat vegetable oil in a large pot over medium-high heat. Add onion halves and ginger, cut side down, and cook until charred, about 5 minutes."
        },
        {
            "name": "Prepare Broth",
            "description": "Add vegetable broth, star anise, cinnamon stick, cardamom pods, cloves, and coriander seeds to the pot. Bring to a boil, then reduce heat and simmer for 30 minutes."
        },
        {
            "name": "Strain Broth",
            "description": "Strain the broth into a large bowl, discarding the solids. Stir in soy sauce and brown sugar, then return the broth to the pot and keep warm over low heat."
        },
        {
            "name": "Prepare Noodles",
            "description": "Cook rice noodles according to package instructions, then drain and set aside."
        },
        {
            "name": "Prepare Vegetables",
            "description": "Steam or sauté your choice of vegetables until just tender."
        },
        {
            "name": "Assemble Pho",
            "description": "Divide the cooked noodles among 4 serving bowls. Ladle the hot broth over the noodles, then top with cooked vegetables, a squeeze of lime, bean sprouts, fresh herbs, green onions, and jalapeno slices."
        },
        {
            "name": "Serve",
            "description": "Serve with sriracha and hoisin sauce on the side for guests to season their pho to taste."
        }
    ]
}

app.post('/api/recipe', async (req, res) => {
  const body = req.body;
  const ingredients = body.ingredients;

  const prompt = `
    Create a recipe with the list of ingredients defined in the markup.
    <ingredients>${JSON.stringify(ingredients)}</ingredients>
    You can include typical ingredients found in a kitchen such as salt, pepper, condiments, olive oil, onions, and garlic.

    If the list of ingredients is empty or you can't find ingredients inside, just answer with "false" without any other character.

    If you have found a recipe, send the output in JSON format as the following sample in ***

    ***
    ${JSON.stringify(recipeSample)}
    ***
  `;
  console.log(prompt);

  const completion = await openai.createChatCompletion ({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {role: "system", content: "You are a cooking expert that creates healthy recipes."},
      {role: "user", content: prompt}
    ],
  });
  res.json(completion.data.choices[0].message.content);
  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
