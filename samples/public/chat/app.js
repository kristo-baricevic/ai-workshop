const OPENAI_KEY = "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";
const price = 0.0002/1000;

const messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant that speaks in a funny way."
    },
];
let totalTokens = 0;

async function sendChat() {
    const prompt = document.querySelector("#prompt").value;
    document.querySelector("#prompt").value = "";
    document.querySelector("ul").innerHTML += `<li><b>${prompt}</b></li>`

    messages.push({
        "role": "user",
        "content": prompt
      })

    const data = {
        "model": "gpt-3.5-turbo",
        "temperature": 0,
        messages
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(data)
    })

    const json = await response.json();
    messages.push(json.choices[0].message);
    const message = json.choices[0].message.content;
    document.querySelector("ul").innerHTML += `<li>${message}</li>`

    // TODO make query and parse results

    document.querySelector("#prompt").value = "";
    document.querySelector("input").focus();
}