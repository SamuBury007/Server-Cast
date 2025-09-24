const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL mancante');

  try {
    const response = await fetch(url);
    let html = await response.text();

    // Rimuove target="_blank" dai link
    html = html.replace(/target="_blank"/g, '');

    res.send(html);
  } catch (err) {
    res.status(500).send('Errore nel proxy: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy online su http://localhost:${PORT}`));
