// API Configuration
const API_BASE = '/api/v1';

// State
let currentPage = 1;
let currentEndpoint = 'latest';
let isLoading = false;
let allMovies = [];

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');
const movieModal = document.getElementById('movieModal');
const modalContent = document.getElementById('modalContent');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMovies('latest');
    
    // Search on Enter
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies();
    });
    
    // Close modal on click outside
    movieModal?.addEventListener('click', (e) => {
        if (e.target === movieModal) closeModal();
    });
});

// Load movies
async function loadMovies(endpoint, page = 1, reset = true) {
    if (isLoading) return;
    isLoading = true;
    
    showLoading(true);
    if (reset) {
        movieGrid.innerHTML = '';
        currentPage = 1;
    }
    
    try {
        const url = endpoint.includes('/') 
            ? `${API_BASE}/${endpoint}?page=${page}`
            : `${API_BASE}/${endpoint}?page=${page}`;
        
        console.log('Fetching:', url);
        const response = await fetch(url);
        const data = await response.json();
        
        let movies = data.data || data.result || [];
        
        if (reset) {
            allMovies = movies;
        } else {
            allMovies = [...allMovies, ...movies];
        }
        
        renderMovies(movies, !reset);
        currentEndpoint = endpoint;
        currentPage = page;
        
        // Update section title
        updateSectionTitle(endpoint);
        
        // Show/hide load more
        loadMoreContainer.style.display = movies.length > 0 ? 'block' : 'none';
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError();
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// Render movies to grid
function renderMovies(movies, append = false) {
    if (!movies || movies.length === 0) {
        if (!append) {
            emptyState.classList.remove('hidden');
            loadMoreContainer.style.display = 'none';
        }
        return;
    }
    
    emptyState.classList.add('hidden');
    
    const html = movies.map(movie => createMovieCard(movie)).join('');
    
    if (append) {
        movieGrid.innerHTML += html;
    } else {
        movieGrid.innerHTML = html;
    }
}

// Create movie card HTML
function createMovieCard(movie) {
    const title = movie.title || movie.options?.name || 'Unknown';
    const poster = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
    const rating = movie.rating || 'N/A';
    const quality = movie.quality || 'HD';
    const categories = movie.categories || '';
    const url = movie.downloadLink || movie.options?.url || '#';
    
    return `
        <div class="movie-card cursor-pointer group" onclick="openModal('${encodeURIComponent(JSON.stringify(movie))}')">
            <div class="relative rounded-xl overflow-hidden bg-secondary">
                <img src="${poster}" alt="${title}" 
                     class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                
                <!-- Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                        <button class="w-full bg-accent hover:bg-accentHover text-primary font-semibold py-2 rounded-lg transition">
                            <i class="fas fa-play mr-2"></i>Watch
                        </button>
                    </div>
                </div>
                
                <!-- Badges -->
                <div class="absolute top-2 left-2 flex gap-2">
                    <span class="bg-accent text-primary text-xs font-bold px-2 py-1 rounded">${quality}</span>
                </div>
                <div class="absolute top-2 right-2">
                    <span class="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <i class="fas fa-star text-yellow-400"></i>${rating}
                    </span>
                </div>
            </div>
            
            <div class="mt-3">
                <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-accent transition">${title}</h3>
                <p class="text-xs text-gray-400 mt-1 line-clamp-1">${categories}</p>
            </div>
        </div>
    `;
}

// Load more
function loadMore() {
    loadMovies(currentEndpoint, currentPage + 1, false);
}

// Load by genre
function loadByGenre(genre) {
    setActiveGenre(genre);
    loadMovies(`genre/${genre}`, 1, true);
}

// Search movies
function searchMovies() {
    const query = searchInput?.value?.trim();
    if (!query) {
        loadMovies('latest');
        return;
    }
    
    sectionTitle.textContent = `Search: "${query}"`;
    
    // Filter from loaded movies first
    const filtered = allMovies.filter(m => {
        const title = (m.title || m.options?.name || '').toLowerCase();
        return title.includes(query.toLowerCase());
    });
    
    if (filtered.length > 0) {
        movieGrid.innerHTML = '';
        renderMovies(filtered);
    } else {
        // Try API search
        fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => {
                const movies = data.data || data.result || [];
                movieGrid.innerHTML = '';
                if (movies.length > 0) {
                    renderMovies(movies);
                } else {
                    emptyState.classList.remove('hidden');
                }
            })
            .catch(err => console.error(err));
    }
}

// Open movie modal
function openModal(movieJson) {
    const movie = JSON.parse(decodeURIComponent(movieJson));
    
    modalContent.innerHTML = `
        <div class="relative">
            <img src="${movie.poster || 'https://via.placeholder.com/600x400'}" 
                 class="w-full h-64 object-cover rounded-t-2xl"
                 onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
            <button onclick="closeModal()" class="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="p-6">
            <h2 class="text-2xl font-bold mb-2">${movie.title || 'Unknown'}</h2>
            <div class="flex items-center gap-4 mb-4">
                <span class="bg-accent text-primary text-sm font-bold px-3 py-1 rounded">${movie.quality || 'HD'}</span>
                <span class="flex items-center gap-1 text-yellow-400">
                    <i class="fas fa-star"></i>${movie.rating || 'N/A'}
                </span>
            </div>
            <p class="text-gray-400 mb-4">${movie.categories || 'No categories'}</p>
            <a href="${movie.downloadLink || movie.options?.url || '#'}" target="_blank" 
               class="inline-block w-full text-center bg-accent hover:bg-accentHover text-primary font-semibold py-3 rounded-xl transition">
                <i class="fas fa-play mr-2"></i>Watch Now
            </a>
        </div>
    `;
    
    movieModal.classList.remove('hidden');
    movieModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    movieModal.classList.add('hidden');
    movieModal.classList.remove('flex');
    document.body.style.overflow = '';
}

// Set active genre
function setActiveGenre(genre) {
    document.querySelectorAll('.genre-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.textContent.toLowerCase() === genre || (genre === 'latest' && tag.textContent === 'All')) {
            tag.classList.add('active');
        }
    });
}

// Update section title
function updateSectionTitle(endpoint) {
    if (endpoint === 'latest') {
        sectionTitle.textContent = 'Latest Updates';
    } else if (endpoint.startsWith('genre/')) {
        const genre = endpoint.split('/')[1];
        sectionTitle.textContent = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
    } else {
        sectionTitle.textContent = 'Movies';
    }
}

// Show loading
function showLoading(show) {
    if (show) {
        loadingState.classList.remove('hidden');
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
    } else {
        loadingState.classList.add('hidden');
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Movies';
    }
}

// Show error
function showError() {
    emptyState.classList.remove('hidden');
    emptyState.querySelector('h3').textContent = 'Failed to load movies';
    emptyState.querySelector('p').textContent = 'Please try again later';
}
