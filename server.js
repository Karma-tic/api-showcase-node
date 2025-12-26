const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const projects = [
    { id: 1, name: "Web Scraper", status: "Completed" },
    { id: 2, name: "API Showcase", status: "In Progress" }
];

// --- NEW CODE START ---
// Add a route for the root "/"
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the API Showcase!</h1><p>Visit <a href='/api/projects'>/api/projects</a> to see the data.</p>");
});
// --- NEW CODE END ---

app.get('/api/projects', (req, res) => {
    res.json({
        message: "Success",
        data: projects
    });
});
// POST Request: "Create" data
// We expect the user to send JSON data with a "name"
app.post('/api/projects', (req, res) => {
    const newProject = req.body; // accessing the data sent by the user
    
    // Simple logic to add ID (in a real DB, this is automatic)
    newProject.id = projects.length + 1;
    newProject.status = newProject.status || "Pending";

    // Add to our local array
    projects.push(newProject);

    // Send back the created object (Standard REST practice)
    res.status(201).json({
        message: "Project created successfully",
        data: newProject
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});