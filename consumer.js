require('dotenv').config();
const axios = require('axios');

async function fetchProgrammingJoke() {
    // The URL (Endpoint) of the API
    const url = process.env.API_URL;
    if (!url) {
        console.error("Error: API_URL is missing from .env file");
        return;
    }

    console.log(`1. Sending request to: ${url}`);

    try {
        // GET request: asking for data
        const response = await axios.get(url);

        // In axios, response.data holds the actual body
        if (response.status === 200) {
            console.log("2. Connection successful! (Status 200)");

            const data = response.data;

         
            console.log(`Joke: ${data.joke}`);
          
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}

fetchProgrammingJoke();
