const { ipcRenderer } = require('electron');

// Get DOM elements
const navSearchInput = document.querySelector('#nav-search');
const mainSearchInput = document.querySelector('#main-search');
const backButton = document.querySelector('#back-btn');
const forwardButton = document.querySelector('#forward-btn');
const homeButton = document.querySelector('#home-btn');
const refreshButton = document.querySelector('#refresh-btn');
const settingsButton = document.querySelector('#settings-btn');
const webviewContainer = document.querySelector('#webview-container');
const homeContent = document.querySelector('#home-content');
const webview = document.querySelector('#webview');

// Handle refresh
refreshButton?.addEventListener('click', () => {
    if (webviewContainer.classList.contains('hidden')) {
        // Refresh the feed if we're on the home page
        loadNewsFeed();
    } else {
        // Refresh the webview if we're browsing
        webview.reload();
    }
});

// Navigation history
let currentURL = '';

// Show/hide content
function showWebView() {
    webviewContainer.classList.remove('hidden');
    homeContent.classList.add('hidden');
}

function showHomeContent() {
    webviewContainer.classList.add('hidden');
    homeContent.classList.remove('hidden');
}

// Handle navigation search
function handleNavSearch(event) {
    if (event.key === 'Enter') {
        const searchText = event.target.value.trim();
        if (searchText) {
            let url = searchText;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                // If it's not a URL, treat it as a Google search
                url = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
            }
            webview.src = url;
            currentURL = url;
            showWebView();
        }
    }
}

// Handle main search
function handleMainSearch(event) {
    if (event.key === 'Enter') {
        const searchText = event.target.value.trim();
        if (searchText) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
            webview.src = url;
            currentURL = url;
            navSearchInput.value = url;
            showWebView();
        }
    }
}

// Handle back navigation
function handleBack() {
    if (webview.canGoBack()) {
        webview.goBack();
    }
}

// Handle forward navigation
function handleForward() {
    if (webview.canGoForward()) {
        webview.goForward();
    }
}

// Handle home button
function handleHome() {
    showHomeContent();
    navSearchInput.value = '';
    mainSearchInput.value = '';
}

// Event listeners
navSearchInput?.addEventListener('keypress', handleNavSearch);
mainSearchInput?.addEventListener('keypress', handleMainSearch);
backButton?.addEventListener('click', handleBack);
forwardButton?.addEventListener('click', handleForward);
homeButton?.addEventListener('click', handleHome);

// Listen for URL updates from main process
ipcRenderer.on('url-update', (event, url) => {
    navSearchInput.value = url;
    currentURL = url;
});

// Add voice search functionality
const navVoiceButton = document.querySelector('#nav-voice-btn');
const mainVoiceButton = document.querySelector('#main-voice-btn');

function handleVoiceSearch(searchInput) {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            searchInput.value = text;
            const searchEvent = new KeyboardEvent('keypress', { key: 'Enter' });
            searchInput.dispatchEvent(searchEvent);
        };
        
        recognition.start();
    }
}

navVoiceButton?.addEventListener('click', () => handleVoiceSearch(navSearchInput));
mainVoiceButton?.addEventListener('click', () => handleVoiceSearch(mainSearchInput));

// Webview events
webview.addEventListener('did-start-loading', () => {
    navSearchInput.classList.add('animate-pulse');
});

webview.addEventListener('did-stop-loading', () => {
    navSearchInput.classList.remove('animate-pulse');
});

webview.addEventListener('did-navigate', (event) => {
    currentURL = event.url;
    navSearchInput.value = event.url;
});

webview.addEventListener('did-navigate-in-page', (event) => {
    currentURL = event.url;
    navSearchInput.value = event.url;
});

// Update navigation buttons state
webview.addEventListener('did-navigate', () => {
    backButton.classList.toggle('opacity-50', !webview.canGoBack());
    forwardButton.classList.toggle('opacity-50', !webview.canGoForward());
});
