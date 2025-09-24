import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import cheerio from 'cheerio';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/extract', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL mancante');

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const videos = [];

    // Cerca tutti i tag <video>
    $('video').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src) videos.push(src);
      // controlla anche eventuali <source> dentro <video>
      $(elem).find('source').each((j, source) => {
        const s = $(source).attr('src');
        if (s) videos.push(s);
      });
    });

    // Cerca eventuali video embedded in <iframe> (VixSrc o altri)
    $('iframe').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src) videos.push(src);
    });

    res.json({ videos: [...new Set(videos)] }); // rimuove duplicati
  } catch (err) {
    res.status(500).send('Errore: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Web Video Caster online su http://localhost:${PORT}`));
