import ytModule from 'youtube-transcript';

// సర్వర్‌కి అర్థమయ్యేలా ప్యాకేజీని కరెక్ట్ గా సెట్ చేయడం
const YoutubeTranscript = ytModule.YoutubeTranscript || ytModule.default || ytModule;

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
    res.status(500).json({ error: 'ట్రాన్స్క్రిప్ట్ దొరకలేదు బ్రో: ' + error.message });
  }
}
