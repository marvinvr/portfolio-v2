import { YOUTUBE_API_KEY } from "$env/static/private";
import { json, error } from "@sveltejs/kit";
import NodeCache from "node-cache";

export const prerender = false;

interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    url: string;
}

const cache = new NodeCache({ stdTTL: 60 * 60 * 3 });
const PLAYLIST_ID = 'PLyciMZ-Pnfm3RIlkrzgFG4iXCO-Nu6UtP';

export async function GET() {
    const cacheKey = `youtube_playlist_${PLAYLIST_ID}`;
    const cachedVideos = cache.get<YouTubeVideo[]>(cacheKey);
    
    if (cachedVideos) {
        return json({ videos: cachedVideos, playlistUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}` });
    }

    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=3&order=date&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
        error(response.status, `YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description ? 
            (item.snippet.description.length > 150 ? 
                item.snippet.description.substring(0, 150) + '...' : 
                item.snippet.description) : '',
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }));

    cache.set(cacheKey, videos);
    return json({ videos, playlistUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}` });
}