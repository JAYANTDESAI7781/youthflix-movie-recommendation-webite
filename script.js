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
  
  // Get current watchlist from localStorage
  const watchlist = getWatchlist();
  
  movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      
      // Get the ID and type (movie or tv)
      const contentId = movie.id;
      const contentType = movie.first_air_date ? 'tv' : 'movie';
      
      // Check if this movie is already in watchlist
      const isInWatchlist = watchlist.some(item => item.id === contentId && item.type === contentType);
      
      // Make the entire movie card clickable
      movieElement.addEventListener('click', () => {
          // Show movie details modal instead of redirecting
          showMovieDetails(contentId, contentType);
      });
      
      movieElement.innerHTML = `
          <div class="movie-image-container">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}" onerror="this.src='images/no-poster.jpg'">
              <div class="movie-overlay">
                  <div class="movie-overlay-buttons">
                      <button onclick="event.stopPropagation(); showMovieDetails(${contentId}, '${contentType}')">View Details</button>
                      <button class="watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}" 
                              onclick="event.stopPropagation(); toggleWatchlist(${contentId}, '${contentType}', '${(movie.title || movie.name).replace(/'/g, "\\'")}', '${movie.poster_path || ''}')">
                          ${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </button>
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

async function showMovieDetails(id, type) {
  // Show loading in the modal
  const modal = document.getElementById('movie-details-modal');
  const detailsContainer = document.getElementById('movie-details-container');
  detailsContainer.innerHTML = '<div class="loading"></div>';
  modal.style.display = 'flex';
  
  try {
      // Fetch detailed movie information
      const detailsResponse = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,similar`);
      const details = await detailsResponse.json();
      
      // Fetch videos to get trailer
      const videosResponse = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
      const videos = await videosResponse.json();
      
      // Find YouTube trailer if available
      const trailer = videos.results.find(video => 
          (video.type === 'Trailer' || video.type === 'Teaser') && 
          video.site === 'YouTube'
      );
      
      // Get current watchlist status
      const watchlist = getWatchlist();
      const isInWatchlist = watchlist.some(item => item.id === id && item.type === type);
      
      // Build the HTML for the modal
      let detailsHTML = `
          <div class="movie-details-header" style="background-image: url('https://image.tmdb.org/t/p/original${details.backdrop_path}')">
              <div class="movie-details-overlay">
                  <div class="movie-details-info">
                      <div class="movie-details-poster">
                          <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name}">
                      </div>
                      <div class="movie-details-text">
                          <h1>${details.title || details.name}</h1>
                          <div class="movie-details-meta">
                              <span>${details.release_date || details.first_air_date ? new Date(details.release_date || details.first_air_date).getFullYear() : 'N/A'}</span>
                              <span>${details.runtime || (details.episode_run_time && details.episode_run_time[0]) || 'N/A'} min</span>
                              <span>⭐ ${details.vote_average.toFixed(1)}</span>
                          </div>
                          <div class="movie-details-genres">
                              ${details.genres.map(genre => `<span>${genre.name}</span>`).join('')}
                          </div>
                          <p class="movie-details-overview">${details.overview}</p>
                          <div class="movie-details-actions">
                              <button onclick="toggleWatchlist(${id}, '${type}', '${(details.title || details.name).replace(/'/g, "\\'")}', '${details.poster_path || ''}')" 
                                      class="btn-watchlist ${isInWatchlist ? 'in-watchlist' : ''}">
                                  ${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
      
      // Add trailer section if available
      if (trailer) {
          detailsHTML += `
              <div class="movie-trailer">
                  <h2>Trailer</h2>
                  <div class="trailer-container">
                      <iframe 
                          width="100%" 
                          height="500" 
                          src="https://www.youtube.com/embed/${trailer.key}" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen>
                      </iframe>
                  </div>
              </div>
          `;
      }
      
      // Add cast section
      detailsHTML += `
          <div class="movie-cast">
              <h2>Cast</h2>
              <div class="cast-list">
                  ${details.credits.cast.slice(0, 8).map(actor => `
                      <div class="cast-member">
                          <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" 
                               alt="${actor.name}" 
                               onerror="this.src='images/no-profile.jpg'">
                          <p class="cast-name">${actor.name}</p>
                          <p class="cast-character">${actor.character}</p>
                      </div>
                  `).join('')}
              </div>
          </div>
      `;
      
      // Add similar movies section
      if (details.similar.results.length > 0) {
          detailsHTML += `
              <div class="similar-movies">
                  <h2>Similar ${type === 'movie' ? 'Movies' : 'Shows'}</h2>
                  <div class="similar-list">
                      ${details.similar.results.slice(0, 6).map(similar => `
                          <div class="similar-item" onclick="showMovieDetails(${similar.id}, '${type}')">
                              <img src="https://image.tmdb.org/t/p/w342${similar.poster_path}" 
                                   alt="${similar.title || similar.name}" 
                                   onerror="this.src='images/no-poster.jpg'">
                              <p>${similar.title || similar.name}</p>
                          </div>
                      `).join('')}
                  </div>
              </div>
          `;
      }
      
      // Update the modal content
      detailsContainer.innerHTML = detailsHTML;
      
  } catch (error) {
      console.error('Error fetching movie details:', error);
      detailsContainer.innerHTML = '<p>Error loading movie details. Please try again later.</p>';
  }
}

// Function to close the movie details modal
function closeMovieModal() {
  document.getElementById('movie-details-modal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('movie-details-modal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
}
// Get watchlist from localStorage
function getWatchlist() {
  const watchlistData = localStorage.getItem('youthflix-watchlist');
  return watchlistData ? JSON.parse(watchlistData) : [];
}

// Save watchlist to localStorage
function saveWatchlist(watchlist) {
  localStorage.setItem('youthflix-watchlist', JSON.stringify(watchlist));
}

// Toggle movie in watchlist
function toggleWatchlist(id, type, title, posterPath) {
  const watchlist = getWatchlist();
  const itemIndex = watchlist.findIndex(item => item.id === id && item.type === type);
  
  if (itemIndex !== -1) {
      // Remove from watchlist
      watchlist.splice(itemIndex, 1);
      showToast('Removed from watchlist');
  } else {
      // Add to watchlist
      watchlist.push({
          id,
          type,
          title,
          posterPath,
          addedOn: new Date().toISOString()
      });
      showToast('Added to watchlist');
  }
  
  saveWatchlist(watchlist);
  
  // Update button text if it exists on page
  const button = document.querySelector(`.watchlist-btn[onclick*="${id}"]`);
  if (button) {
      if (itemIndex !== -1) {
          button.textContent = 'Add to Watchlist';
          button.classList.remove('in-watchlist');
      } else {
          button.textContent = 'Remove from Watchlist';
          button.classList.add('in-watchlist');
      }
  }
}

// Display toast notification
function showToast(message) {
  // Check if a toast container already exists
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Show the toast
  setTimeout(() => {
      toast.classList.add('show');
  }, 100);
  
  // Remove the toast after 3 seconds
  setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
          toastContainer.removeChild(toast);
      }, 300);
  }, 3000);
}
// Display watchlist movies
function displayWatchlist() {
  const watchlist = getWatchlist();
  const moviesContainer = document.getElementById('movies');
  moviesContainer.innerHTML = '';
  
  if (watchlist.length === 0) {
      moviesContainer.innerHTML = '<p>Your watchlist is empty. Add movies to watch later!</p>';
      return;
  }
  
  // Create a heading
  const heading = document.createElement('h2');
  heading.className = 'section-title';
  heading.textContent = 'Your Watchlist';
  moviesContainer.appendChild(heading);
  
  // Create container for watchlist items
  const watchlistGrid = document.createElement('div');
  watchlistGrid.className = 'movies';
  moviesContainer.appendChild(watchlistGrid);
  
  watchlist.forEach(item => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      
      movieElement.addEventListener('click', () => {
          showMovieDetails(item.id, item.type);
      });
      
      movieElement.innerHTML = `
          <div class="movie-image-container">
              <img src="https://image.tmdb.org/t/p/w500${item.posterPath}" alt="${item.title}" onerror="this.src='images/no-poster.jpg'">
              <div class="movie-overlay">
                  <div class="movie-overlay-buttons">
                      <button onclick="event.stopPropagation(); showMovieDetails(${item.id}, '${item.type}')">View Details</button>
                      <button class="watchlist-btn in-watchlist" 
                              onclick="event.stopPropagation(); toggleWatchlist(${item.id}, '${item.type}', '${item.title.replace(/'/g, "\\'")}', '${item.posterPath || ''}')">
                          Remove from Watchlist
                      </button>
                  </div>
              </div>
          </div>
          <div class="movie-info">
              <h3>${item.title}</h3>
              <p>Added: ${new Date(item.addedOn).toLocaleDateString()}</p>
          </div>
      `;
      
      watchlistGrid.appendChild(movieElement);
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
