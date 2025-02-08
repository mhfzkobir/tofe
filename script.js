// Playlist URL
const playlistUrl = "https://raw.githubusercontent.com/byte-capsule/Toffee-Channels-Link-Headers/refs/heads/main/toffee_NS_Player.m3u";

// Fetch the playlist and parse it
async function fetchAndLoadChannels() {
  const channelList = document.getElementById('channel-list');

  try {
    const response = await fetch(playlistUrl);
    const playlistText = await response.text();

    const channels = parseM3U(playlistText);

    channels.forEach(channel => {
      const channelItem = document.createElement('div');
      channelItem.className = 'channel-item';

      const img = document.createElement('img');
      img.src = channel.logo || 'https://via.placeholder.com/100';
      img.alt = channel.name;

      const title = document.createElement('div');
      title.textContent = channel.name;

      channelItem.appendChild(img);
      channelItem.appendChild(title);

      channelItem.onclick = () => {
        const url = new URL('player.html', window.location.href);
        url.searchParams.set('link', encodeURIComponent(channel.link));
        url.searchParams.set('origin', channel.origin || '');
        url.searchParams.set('http-user-agent', channel.userAgent || '');
        url.searchParams.set('cookie', channel.cookie || '');

        window.location.href = url.toString();
      };

      channelList.appendChild(channelItem);
    });
  } catch (error) {
    console.error('Failed to load channels:', error);
  }
}

// Helper to parse M3U playlist
function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];

  let channelInfo = {};

  lines.forEach(line => {
    if (line.startsWith('#EXTINF')) {
      const nameMatch = line.match(/,(.+)/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      channelInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Unnamed Channel',
        logo: logoMatch ? logoMatch[1] : '',
      };
    } else if (line.startsWith('http')) {
      channelInfo.link = line.trim();
      channels.push(channelInfo);
      channelInfo = {}; // Reset for the next channel
    }
  });

  return channels;
}

// Load channels on page load
fetchAndLoadChannels();
