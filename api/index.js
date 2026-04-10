export default async function handler(req, res) {
  // మీ వెబ్‌సైట్ కి పర్మిషన్స్
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'యూట్యూబ్ లింక్ ఇవ్వలేదు బ్రో.' });
  }

  try {
    // మనం ఒక బ్రౌజర్ లాగా యూట్యూబ్ లోకి వెళ్తున్నాం (ఎలాంటి ప్యాకేజీ లేకుండా)
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = await response.text();

    // పేజీలో దాగి ఉన్న సబ్‌టైటిల్స్ లింక్ వెతకడం
    const captionsRegex = /"captionTracks":(\[.*?\])/;
    const match = captionsRegex.exec(html);

    if (!match || !match[1]) {
      return res.status(404).json({ error: 'సారీ బ్రో! ఈ వీడియోకి సబ్‌టైటిల్స్ (CC) లేవు.' });
    }

    // టెక్స్ట్ డౌన్‌లోడ్ చేయడం
    const captionTracks = JSON.parse(match[1]);
    const trackUrl = captionTracks[0].baseUrl; 
    const transcriptResponse = await fetch(trackUrl);
    const transcriptXml = await transcriptResponse.text();

    // ఎక్స్ఎంఎల్ (XML) నుండి టెక్స్ట్ ని లాగడం
    const textRegex = /<text.*?>(.*?)<\/text>/g;
    let transcripts = [];
    let textMatch;
    
    while ((textMatch = textRegex.exec(transcriptXml)) !== null) {
      let cleanText = textMatch[1]
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      transcripts.push({ text: cleanText });
    }

    res.status(200).json(transcripts);

  } catch (error) {
    res.status(500).json({ error: 'టెక్నికల్ ఎర్రర్: ' + error.message });
  }
}
