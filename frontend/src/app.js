// Config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const POLLING_INTERVAL = Number(import.meta.env.VITE_POLLING_INTERVAL) || 30000;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 5000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_RETRIES) || 10;
const DEFAULT_TARGET_URL = import.meta.env.VITE_DEFAULT_TARGET_URL || 'https://example.com';


// Elements
console.log('%c ProxySite App v2.1 Loaded ', 'background: #222; color: #bada55; padding: 4px; border-radius: 4px;');
const urlInput = document.getElementById('urlInput');
const goBtn = document.getElementById('goBtn');
const refreshBtn = document.getElementById('refreshBtn');
const passwordInput = document.getElementById('proxyPassword');
const iframe = document.getElementById('browser-frame');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const connectionIndicator = document.getElementById('connection-status');
const statusMessage = document.getElementById('status-message');

// State
let isBackendReady = false;

// --- Helper Functions ---

function setConnectionStatus(status) {
    connectionIndicator.className = 'status-indicator ' + status;
    const titles = {
        online: 'Connected to Backend',
        offline: 'Backend Offline/Sleeping',
        checking: 'Checking connection...'
    };
    connectionIndicator.title = titles[status];
    isBackendReady = status === 'online';
}

function showLoading(show, message = 'Loading...') {
    if (show) {
        loadingText.textContent = message;
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        return 'https://' + url;
    }
    return url;
}

function setStatus(msg, type = 'info') {
    statusMessage.textContent = msg;
    statusMessage.style.color = type === 'error' ? '#ef4444' : '#6b7280';
    if (type === 'error') {
        setTimeout(() => { statusMessage.textContent = ''; }, 5000);
    }
}

// --- Backend Comms ---

async function checkBackend() {
    setConnectionStatus('checking');
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), API_TIMEOUT);
        const res = await fetch(`${BACKEND_URL}/ping`, { signal: controller.signal });
        clearTimeout(id);
        
        if (res.ok) {
            setConnectionStatus('online');
        } else {
            throw new Error('Not OK');
        }
    } catch (e) {
        setConnectionStatus('offline');
        console.log('Backend check failed:', e);
    }
}

async function ensureBackendAwake() {
    if (isBackendReady) return true;
    
    showLoading(true, 'Waking up backend... (this might take 30s)');
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
        await checkBackend();
        if (isBackendReady) {
            showLoading(false);
            return true;
        }
        attempts++;
        await new Promise(r => setTimeout(r, 4000));
    }
    
    showLoading(false);
    setStatus('Failed to connect to backend. Is it running?', 'error');
    return false;
}

// --- Proxy Logic ---

async function navigate(url) {
    const targetUrl = normalizeUrl(url);
    const password = passwordInput.value;

    if (!targetUrl) return;
    if (!password) {
        setStatus('Please enter the Proxy Password first.', 'error');
        passwordInput.focus();
        passwordInput.classList.add('shake');
        return;
    }

    // Update UI
    urlInput.value = targetUrl;
    
    // Check Backend
    const ready = await ensureBackendAwake();
    if (!ready) return;

    showLoading(true, `Loading ${new URL(targetUrl).hostname}...`);
    setStatus('Loading...', 'info');

    // Construct Direct Proxy URL
    // Handle relative BACKEND_URL (e.g., /api)
    const baseUrl = BACKEND_URL.startsWith('http') ? BACKEND_URL : window.location.origin + BACKEND_URL;
    const proxyUrl = new URL(`${baseUrl}/proxy`);
    proxyUrl.searchParams.set('target', targetUrl);
    // Send auth as query param since we can't set headers on iframe.src
    proxyUrl.searchParams.set('password', password); 
    proxyUrl.searchParams.set('frontend_url', window.location.origin);

    // Handler for load event
    const loadHandler = () => {
        showLoading(false);
        setStatus('Loaded successfully', 'success');
        iframe.removeEventListener('load', loadHandler);
    };
    
    // Handler for errors is tricky with iframe.src, but we can assume success if load triggers
    // or rely on the backend error page rendering.
    
    iframe.addEventListener('load', loadHandler);
    iframe.src = proxyUrl.toString();
}

// --- Event Listeners ---

// Initial Load
urlInput.value = DEFAULT_TARGET_URL;
checkBackend();

// Performance Optimization: Suspend background polling when tab is not visible
setInterval(() => {
    if (document.visibilityState === 'visible') {
        checkBackend();
    }
}, POLLING_INTERVAL); // Heartbeat

// Inputs
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        navigate(urlInput.value);
    }
});

goBtn.addEventListener('click', () => {
    navigate(urlInput.value);
});

refreshBtn.addEventListener('click', () => {
    navigate(urlInput.value);
});

const themeToggle = document.getElementById('themeToggle');

// --- Theme Logic ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);

// --- Password Persistence Logic ---
function initPassword() {
    const savedPassword = sessionStorage.getItem('proxy_password');
    if (savedPassword) {
        passwordInput.value = savedPassword;
        // Trigger generic "change" so any other listeners know
        setStatus('');
    }
}

passwordInput.addEventListener('input', (e) => {
    sessionStorage.setItem('proxy_password', e.target.value);
    if (e.target.value) setStatus('');
});

// Initialize features on load
initTheme();
initPassword();

