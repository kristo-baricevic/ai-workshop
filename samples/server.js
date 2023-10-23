const { Configuration, OpenAIApi } = require("openai");

const OPENAI_KEY = "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";

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

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
  apiKey: OPENAI_KEY,
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
  
})

const recipeSample = {

}

app.post('/api/recipe', async (req, res) => {
  const body = req.body;
  const ingredients = req.ingredients;

  const prompt = `
    Create a recipe with the list of ingredients defined in the markup.
    <ingredients>${ingredients}</ingredients>
    You can include typical ingredients found in a kitchen such as salt, pepper, condiments, olive oil, onions, and garlic.

    If the list of ingredients is empty or you can't find ingredients inside, just answer with "false" without any other character.

    If you have found a recipe, send the output in JSON format as the following sample in ***

    ***
    ${recipeSample}
    ***
  `;

  const completion = await openai.createChatCompletion ({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {role: "system", content: "You are a cooking expert that creates healthy recipes."},
      {role: "user", content: body.prompt}
    ]
  });
  res.json(completion.data.choices[0].message.content);
  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
