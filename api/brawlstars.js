export default async function handler(req, res) {
    // Évite les blocages CORS sur ton GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const { tag } = req.query;
    if (!tag) {
        return res.status(400).json({ error: 'Tag manquant dans l\'URL' });
    }

    // Ton token officiel (propre, sans espace)
    const MY_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImFjYzZhYzllLWQyMTctNGIwYi04ZGQxLWMxMWZjYWRiNmZmYyIsImlhdCI6MTc3OTQyODU1NSwic3ViIjoiZGV2ZWxvcGVyLzkxZWU0OTk3LWY1ZTYtTkU5Zi0zNTk4LTFkYWRlMzhkZDQwZiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMC4wLjAuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.tROUfuUTlpZliv1xXTsCCUUESkxBylYl68UIOMLmxp7MPmEk9uaikZSHwhI7RYrngInWd6SzDyxdIhwhjdzEdQ";

    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    
    // 🚀 L'ASTUCE : On passe par brawland.com au lieu de api.brawlstars.com pour contourner le blocage Vercel
    const url = `https://api.brawland.com/v1/players/%23${cleanTag}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MY_SECRET_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Statut : ${response.status}` });
        }

        const data = await response.json();
        // On renvoie les trophées à ton index.html
        return res.status(200).json({ trophies: data.trophies });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
