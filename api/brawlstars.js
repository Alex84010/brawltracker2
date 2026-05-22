export default async function handler(req, res) {
    // Permet à ton site GitHub Pages de communiquer avec ce serveur sans blocage CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const { tag } = req.query;
    if (!tag) {
        return res.status(400).json({ error: 'Tag manquant dans l\'URL' });
    }

    // Ton Token officiel Supercell est maintenant injecté ici en toute sécurité !
    const MY_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVhNmI3MzMyLWMyODEtNDcxZC04ZDIxLTYyNGRiYzk1MzQ2NyIsImlhdCI6MTc3OTM5OTI1NCwic3ViIjoiZGV2ZWxvcGVyLzkxZWU0OTk3LWY1ZTYt NGU5Zi0zNTk4LTFkYWRlMzhkZDQwZiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMC4wLjAuMCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.cG9JYvFfBU9vg5xqR0G2ILc17yNC_oUBy8rRsB-YbP-S1_1p6k6gVDcMrmJ0BfaAl8Nxo_-sKF9sNS3-5fFotg";

    const cleanTag = tag.replace('#', '').toUpperCase().trim();
    const url = `https://api.brawlstars.com/v1/players/%23${cleanTag}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MY_SECRET_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Erreur Supercell: ${response.statusText}` });
        }

        const data = await response.json();
        // Le serveur extrait les trophées et les renvoie proprement à ton calendrier
        return res.status(200).json({ trophies: data.trophies });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
