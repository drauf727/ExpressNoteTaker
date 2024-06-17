const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const noteData = './db/db.json';

const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile(noteData, 'utf8', (err, data) => {
        let noteList = [];
        if (err) {
            console.log("Unable to read notes");
            return;
        }
        console.log(data);
        if (data) {
            noteList = JSON.parse(data);
        }
        res.json(noteList);
    })
});

app.post('/api/notes', (req, res) => {
    const { text, title } = req.body;
    const postNote = {
        text: text,
        title: title,
        id: uuidv4()
    };
    fs.readFile(noteData, 'utf8', (err, data) => {
        const noteList = JSON.parse(data);
        if (err) {
            console.log("Unable to read notes");
            return;
        }
        noteList.push(postNote);
        fs.writeFile(noteData, JSON.stringify(noteList, null, 2), (err) => {
            if (err) {
                console.log("Error writing note to file");
                return;
            }
            console.log("Success");
        })
    })
    res.json(postNote);
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`)
);