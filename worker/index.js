export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        if (url.pathname === '/api/online') {
            const online = parseInt(await env.KV.get('online') || '0');
            if (request.method === 'POST') {
                const { action } = await request.json();
                const count = action === 'join' ? online + 1 : Math.max(0, online - 1);
                await env.KV.put('online', count.toString());
                return Response.json({ online: count }, { headers: corsHeaders });
            }
            return Response.json({ online }, { headers: corsHeaders });
        }

        if (url.pathname === '/api/rank') {
            const data = await env.KV.get('rank');
            const ranks = data ? JSON.parse(data) : [];
            if (request.method === 'POST') {
                const entry = await request.json();
                entry.time = Date.now();
                ranks.push(entry);
                ranks.sort((a, b) => a.moves - b.moves || a.elapsed - b.elapsed);
                const top = ranks.slice(0, 50);
                await env.KV.put('rank', JSON.stringify(top));
                return Response.json({ ranks: top, rank: top.findIndex(r => r.time === entry.time) + 1 }, { headers: corsHeaders });
            }
            return Response.json({ ranks: ranks.slice(0, 50) }, { headers: corsHeaders });
        }

        return new Response('Not Found', { status: 404, headers: corsHeaders });
    }
};
