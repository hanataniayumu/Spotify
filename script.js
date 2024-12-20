const clientId = "125e10ba2c874e3fa89f53e2e6902d2b"; // SpotifyのクライアントIDをここに設定
const redirecturl = "https://example.org/callback"; // Spotifyのクライアントシークレット
const scopes = "playlist-read-private";
const clientSecret = "YOUR_CLIENT_SECRET"; // Spotifyのクライアントシークレットを設定
let accessToken;

// アクセストークンを取得
async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  accessToken = data.access_token;
}

// Spotify APIで楽曲を検索
async function searchTracks(query) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  displayResults(data.tracks.items);
}

// 検索結果を表示
function displayResults(tracks) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // 結果エリアをクリア

  tracks.forEach((track) => {
    const trackElement = document.createElement("div");
    trackElement.classList.add("track");
    trackElement.innerHTML = `
      <img src="${track.album.images[0]?.url}" alt="Album Art">
      <p><strong>Title:</strong> ${track.name}</p>
      <p><strong>Artist:</strong> ${track.artists.map((artist) => artist.name).join(", ")}</p>
      <p><strong>Album:</strong> ${track.album.name}</p>
      <p><strong>Release Date:</strong> ${track.album.release_date}</p>
      <p><strong>Popularity:</strong> ${track.popularity}</p>
    `;
    resultsContainer.appendChild(trackElement);
  });
}

// イベントリスナーを設定
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-query").value;
  if (query) {
    searchTracks(query);
  }
});

// アクセストークンを初期取得
getAccessToken();
