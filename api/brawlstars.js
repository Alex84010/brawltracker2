const https = require('https');

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const { tag } = req.query;
    if (!tag) {
        return res.status(400).json({ error: 'Tag manquant' });
    }

    const MY_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImFjYzZhYzllLWQyMTctNGIwYi04ZGQxLWMxMWZjYWRiNmZmYyIsImlhdCI6MTc3OTQyODU1NSwic3ViIjoiZGV2ZWxvcGVyLzkxZWU0OTk3LWY1ZTYtTkU5Zi0zNTk4LTFkYWRlMzhkZDQwZiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMC4wLjAuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.tROUfuUTlpZliv1xXTsCCUUESkxBylYl68UIOMLmxp7MPmEk9uaikZSHwhI7RYrngInWd6SzDyxdIhwhjdzEdQ";
    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    
    // Connexion stable via le proxy brawland
    const url = `https://api.brawland.com/v1/players/%23${cleanTag}`;

    https.get(url, {
        headers: {
            'Authorization': `Bearer ${MY_SECRET_TOKEN}`,
            'Accept': 'application/json'
        }
    }, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).json({ error: `Supercell status: ${response.statusCode}` });
            }
            try {
                const parsedData = JSON.parse(data);
                return res.status(200).json({ trophies: parsedData.trophies });
            } catch (e) {
                return res.status(500).json({ error: "Erreur lecture donnees" });
            }
        });

    }).on("error", (err) => {
        return res.status(500).json({ error: err.message });
    });
}
