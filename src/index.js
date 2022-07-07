const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, '../static')));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(require('./routes/index'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app;