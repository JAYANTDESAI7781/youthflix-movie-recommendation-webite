

const API_KEY = '310e35fd81e0bb1834c0685c110e4cc4';
const BASE_URL = 'https://api.themoviedb.org/3';






async function fetchMovies() {
    const type = document.getElementById('type').value;
    const genre = document.getElementById('genre').value;
    const language = document.getElementById('language').value;
    let url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    
    if (language) {
        url += `&with_original_language=${language}`;
    }
    if (genre) {
        url += `&with_genres=${genre}`;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        document.getElementById('movies').innerHTML = '<p>Error loading movies. Please try again later.</p>';
    }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '';
  
  if (movies.length === 0) {
      moviesContainer.innerHTML = '<p>No movies found for the selected criteria.</p>';
      return;
  }
  
  movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      
      // Get the ID and type (movie or tv)
      const contentId = movie.id;
      const contentType = movie.first_air_date ? 'tv' : 'movie';
      
      // Make the entire movie card clickable
      movieElement.addEventListener('click', () => {
          // Redirect to VidSrc with the appropriate ID and type
          window.open(`https://vidsrc.to/embed/${contentType}/${contentId}`, '_blank');
      });
      
      movieElement.innerHTML = `
          <div class="movie-image-container">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" onerror="this.src='images/no-poster.jpg'">
              <div class="movie-overlay">
                  <div class="movie-overlay-buttons">
                      <button onclick="event.stopPropagation(); window.open('https://vidsrc.to/embed/${contentType}/${contentId}', '_blank')">Watch Now</button>
                  </div>
              </div>
          </div>
          <div class="movie-info">
              <h3>${movie.title || movie.name}</h3>
              <p>⭐ Rating: ${movie.vote_average.toFixed(1)}</p>
              <p>📅 Release Date: ${movie.release_date || movie.first_air_date || 'N/A'}</p>
              <p>${movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available'}</p>
          </div>
      `;
      
      moviesContainer.appendChild(movieElement);
  });
}


function searchMovies() {
  const query = document.getElementById('searchInput').value;
  
  if (!query) {
    alert('Please enter a movie name!');
    return;
  }
  
  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '<div class="loading"></div>';
  
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Search Results:', data.results);
      // Call displayMovies to show the search results
      displayMovies(data.results);
    })
    .catch(error => {
      console.error('Error:', error);
      moviesContainer.innerHTML = '<p>Error searching movies. Please try again later.</p>';
    });
}




 // Replace with your actual API key


 // Replace with your TMDB API key
const PROVIDERS = '8|119|337'; // Netflix, Prime Video, Disney+
const REGION = 'US';

const fetchAllGenreWebSeries = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_watch_providers=${PROVIDERS}&watch_region=${REGION}&sort_by=popularity.desc`
    );
    const data = await response.json();
    console.log('All Genre Web Series:', data.results);
    return data.results;
  } catch (error) {
    console.error('Error fetching all-genre web series:', error);
  }
};                   

// Example for reference
const movieCard = `
  <div class="movie-card">
    <img src="${posterUrl}" alt="${title}">
    <h3>${title}</h3>
  </div>
`;



