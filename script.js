const playlistUrl = 'https://raw.githubusercontent.com/byte-capsule/Toffee-Channels-Link-Headers/refs/heads/main/toffee_NS_Player.m3u';

function loadChannels() {
  fetch(playlistUrl)
    .then(response => response.text())
    .then(data => parsePlaylist(data))
    .catch(error => {
      console.error('Error fetching playlist:', error);
      alert('Failed to load channels.');
    });
}

function parsePlaylist(data) {
  const lines = data.split('\n');
  const channels = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const info = lines[i];
      const nameMatch = info.match(/,(.+)$/);
      const logoMatch = info.match(/tvg-logo="(.*?)"/);
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
      const logo = logoMatch ? logoMatch[1].trim() : '';

      const url = lines[i + 1]?.trim();
      if (url) {
        channels.push({ name, logo, url });
      }
    }
  }

  displayChannels(channels);
}

function displayChannels(channels) {
  const channelList = document.getElementById('channel-list');
  channelList.innerHTML = '';

  channels.forEach(channel => {
    const channelItem = document.createElement('div');
    channelItem.className = 'channel-item';
    channelItem.tabIndex = 0;

    const img = document.createElement('img');
    img.src = channel.logo || 'https://via.placeholder.com/100';
    img.alt = channel.name;

    const title = document.createElement('div');
    title.textContent = channel.name;

    channelItem.appendChild(img);
    channelItem.appendChild(title);

    channelItem.onclick = () => {
      window.location.href = `player.html?url=${encodeURIComponent(channel.url)}`;
    };

    channelList.appendChild(channelItem);
  });

  enableTVRemoteSupport();
}

function enableTVRemoteSupport() {
  const channelItems = document.querySelectorAll('.channel-item');
  let currentFocus = 0;

  if (channelItems.length > 0) {
    channelItems[currentFocus].focus();
  }

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowRight':
        if (currentFocus < channelItems.length - 1) currentFocus++;
        break;
      case 'ArrowLeft':
        if (currentFocus > 0) currentFocus--;
        break;
      case 'Enter':
        channelItems[currentFocus].click();
        break;
    }
    channelItems[currentFocus].focus();
  });
}

// Load channels on page load
loadChannels();
