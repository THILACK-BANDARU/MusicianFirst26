// script.js

const clientId = 'aba58a629a554083838347c36ffbf2a3';
const clientSecret = '44c1c9e3c7ba44ae8ac87c8fcd32c7f2';

let accessToken = '';

async function getSpotifyToken() {
    if (accessToken) return accessToken;
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    accessToken = data.access_token;
    return accessToken;
}

async function suggestSongs() {
    const query = document.getElementById('searchInput').value;
    const language = document.getElementById('languageSelect').value;

    if (!query) {
        document.getElementById('suggestionList').innerHTML = '';
        return;
    }

    const token = await getSpotifyToken();
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'track');
    
    if (language !== 'all') {
        url.searchParams.append('market', language);
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    displaySuggestions(data.tracks.items);
}

function displaySuggestions(songs) {
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = '';
    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = `${song.name} - ${song.artists.map(artist => artist.name).join(', ')}`;
        li.onclick = () => selectSong(song);
        suggestionList.appendChild(li);
    });
}

function selectSong(song) {
    document.getElementById('searchInput').value = `${song.name} - ${song.artists.map(artist => artist.name).join(', ')}`;
    document.getElementById('suggestionList').innerHTML = '';
    displaySongList([song]);
}

async function searchSong() {
    const query = document.getElementById('searchInput').value;
    const language = document.getElementById('languageSelect').value;

    if (!query) {
        alert('Please enter a song name or lyrics.');
        return;
    }

    const token = await getSpotifyToken();
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'track');
    
    if (language !== 'all') {
        url.searchParams.append('market', language);
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    displaySongList(data.tracks.items);
}

function displaySongList(songs) {
    const songListDiv = document.getElementById('songList');
    songListDiv.style.display = 'block';
    songListDiv.innerHTML = '';

    songs.forEach(song => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        songItem.innerHTML = `
            <h3>${song.name}</h3>
            <p><strong>Artist:</strong> ${song.artists.map(artist => artist.name).join(', ')}</p>
            <p><strong>Album:</strong> ${song.album.name}</p>
            <p><strong>Release Date:</strong> ${song.album.release_date}</p>
            <button onclick="playSong('${song.preview_url}')">Play Song</button>
            <button onclick="getLyrics('${song.name}', '${song.artists[0].name}')">Get Lyrics</button>
            <audio controls style="display: none;" id="audioPlayer">
                <source src="${song.preview_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        songListDiv.appendChild(songItem);
    });
}

function playSong(previewUrl) {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
        audioPlayer.style.display = 'block';
        audioPlayer.src = previewUrl;
        audioPlayer.play();
    }
}

async function getLyrics(songName, artistName) {
    alert(`Fetching lyrics for ${songName} by ${artistName}...`);
    // Here you can integrate any lyrics API to fetch the lyrics and
}

