const { YoutubeTranscript } = require('youtube-transcript');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Please provide a YouTube video URL (?url=...)' });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    res.status(200).json(transcript);
  } catch (error) {
    res.status(500).json({ error: 'Transcript దొరకలేదు. బహుశా వీడియోకి సబ్‌టైటిల్స్ లేవేమో.' });
  }
}
