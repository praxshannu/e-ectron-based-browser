// Function to fetch news
async function loadNewsFeed() {
    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=YOUR_API_KEY');
        const data = await response.json();
        updateNewsFeed(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to update news feed
function updateNewsFeed(articles) {
    const newsContainer = document.querySelector('.news-grid');
    if (!newsContainer) return;

    newsContainer.innerHTML = articles.slice(0, 6).map(article => `
        <div class="bg-nav-dark rounded-lg overflow-hidden cursor-pointer" 
             onclick="window.open('${article.url}', '_blank')">
            <img src="${article.urlToImage || 'https://picsum.photos/400/200'}" 
                 alt="${article.title}" 
                 class="w-full h-48 object-cover">
            <div class="p-4">
                <span class="text-blue-500 text-sm font-medium">${article.source.name}</span>
                <h3 class="text-white mt-2 font-medium">${article.title}</h3>
                <p class="text-white/70 text-sm mt-2">${article.description || ''}</p>
            </div>
        </div>
    `).join('');
}

// Load news feed on startup
document.addEventListener('DOMContentLoaded', loadNewsFeed);
