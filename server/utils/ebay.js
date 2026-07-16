let cachedToken = null;
let tokenExpiresAt = 0;

//Ebay tokens are typically valid for 2 hours fyi
//Code below check "Do I already have a valid token sitting in memory?"
async function getEbayToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  //Below is the basic Auth header for the token request
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`,
  ).toString('base64');

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },

    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('eBay token error:', res.status, errText);
    throw new Error('Failed to get eBay access token');
  }

  const data = await res.json();
  cachedToken = data.access_token;

  // Below pretty much how much time the ebay token is valid for until it expires
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;
  return cachedToken;
}

async function searchEbay(query, maxResults = 2) {
  try {
    const token = await getEbayToken();

    const url = new URL(
      'https://api.ebay.com/buy/browse/v1/item_summary/search',
    );
    url.searchParams.set('q', query);
    url.searchParams.set('limit', String(maxResults));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('eBay search error:', res.status, errText);
      return [];
    }

    const data = await res.json();

    return (data.itemSummaries || []).map((item) => ({
      externalId: item.itemId,
      source: 'eBay',
      title: item.title,
      meta: item.price ? `$${item.price.value} · eBay` : 'eBay',
      link: item.itemWebUrl,
      thumbnail: item.image?.imageUrl || null,
    }));
  } catch (err) {
    console.error('searchEbay failed:', err.message);
    return [];
  }
}

module.exports = { searchEbay };

// 70% of this file is Authentication/token lifecycle management
// The actual fetching of the list on ebay is in the searchEbay function
