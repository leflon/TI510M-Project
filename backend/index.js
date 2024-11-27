const express = require('express');

const app = express();


app.get('/hi', (req, res) => {
	res.send('Bonjour');
});

const PORT = process.env.PORT || 2525;
app.listen(PORT, () => console.log(`Listening on ::${PORT}`));
