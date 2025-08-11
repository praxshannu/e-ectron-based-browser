async function fetchNews() {
    console.log('Fetching news...');
    const apiKey = 'b6af72163969ba20dd8dff63ad1612a3';
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${b6af72163969ba20dd8dff63ad1612a3}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      function displayNews(articles) {
        console.log('Displaying news...');
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';
        articles.forEach(article => {
          console.log('Article:', article); // Add this line to log the news article
          const newsArticle = document.createElement('div');
          newsArticle.className = 'news-article';
      
          const newsImage = document.createElement('div');
          newsImage.className = 'news-image';
          newsImage.innerHTML = `<img src="${article.urlToImage}" alt="News Image">`;
          newsArticle.appendChild(newsImage);
      
          const newsContent = document.createElement('div');
          newsContent.className = 'news-content';
          newsContent.innerHTML = `
            <div class="news-title">${article.title}</div>
            <div class="news-description">${article.description}</div>
          `;
          newsArticle.appendChild(newsContent);
      
          newsArticle.addEventListener('click', () => {
            window.open(article.url, '_blank');
          });
      
          newsContainer.appendChild(newsArticle);
        });
      }
    }
  }
  
  function displayNews(articles) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
      const newsArticle = document.createElement('div');
      newsArticle.className = 'news-article';
  
      const newsImage = document.createElement('div');
      newsImage.className = 'news-image';
      newsImage.innerHTML = `<img src="${article.urlToImage}" alt="News Image">`;
      newsArticle.appendChild(newsImage);
  
      const newsContent = document.createElement('div');
      newsContent.className = 'news-content';
      newsContent.innerHTML = `
        <div class="news-title">${article.title}</div>
        <div class="news-description">${article.description}</div>
      `;
      newsArticle.appendChild(newsContent);
  
      newsArticle.addEventListener('click', () => {
        window.open(article.url, '_blank');
      });
  
      newsContainer.appendChild(newsArticle);
    });
    
  }
  
  fetchNews();