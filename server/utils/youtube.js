async function searchYouTube(query, maxResults = 2) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY);

  const res = await fetch(url.toString());

  if (!res.ok) {
    const errText = await res.text();
    console.error('YouTube API error:', res.status, errText);
    return [];
  }

  const data = await res.json();

  return (data.items || []).map((item) => ({
    externalId: item.id.videoId,
    source: 'YouTube',
    title: item.snippet.title,
    meta: item.snippet.channelTitle,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      null,
  }));
}

module.exports = { searchYouTube };
