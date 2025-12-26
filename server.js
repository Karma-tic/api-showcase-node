const express = require('express');
// Import the File System module (fs) with promises support
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Path to our JSON file
const DB_PATH = path.join(__dirname, 'projects.json');

app.use(express.json());

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the API Showcase!</h1><p>Visit <a href='/api/projects'>/api/projects</a> to see the data.</p>");
});

// 1. GET Request: Read from FILE
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readData(); // Read from file
        res.json({
            message: "Success",
            data: projects
        });
    } catch (error) {
        res.status(500).json({ message: "Error reading database" });
    }
});

// 2. POST Request: Write to FILE
app.post('/api/projects', async (req, res) => {
    try {
        // 1. Read existing data first
        const projects = await readData();
        
        // 2. Create new project object
        const newProject = req.body;
        newProject.id = projects.length + 1;
        newProject.status = newProject.status || "Pending";

        // 3. Add to array
        projects.push(newProject);

        // 4. WRITE back to file (The Persistence Step!)
        // null, 2 makes the JSON pretty and readable
        await fs.writeFile(DB_PATH, JSON.stringify(projects, null, 2));

        res.status(201).json({
            message: "Project created and saved to disk",
            data: newProject
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});