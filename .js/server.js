import cors from 'cors';
import express from 'express';
import { createConnection } from 'mysql';;

const app = express();

app.use(cors());
var con = createConnection({
    host: "localhost",
    user: "root",
    password: "Mandalorian#35",
    database: "spelling"
});

app.get('/random-word', (req, res) => {
    con.connect((err) => {
        if (err) throw err;
        console.log("Connected!");
        con.query("SELECT * FROM word ORDER BY Rand() LIMIT 1", (err, result, fields) => {
            if (err) throw err;
            console.log(result);
            const databaseWord = result[0].Word; // Accessing the 'Word' property
            console.log(databaseWord);
            res.send(databaseWord); // Send the word to the client
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//