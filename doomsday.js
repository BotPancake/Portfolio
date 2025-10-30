const countdownEl = document.getElementById("countdown");
const tempEl = document.getElementById("temp");
const co2El = document.getElementById("co2");
const energyEl = document.getElementById("energy");

const targetDate = new Date("2026-01-01T00:00:00Z").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdownEl.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;

  if (distance <= 0) {
    countdownEl.textContent = "💥 00D 00H 00M 00S 💥";
  }
}

async function fetchRealData() {
  try {
    // Example: Replace these URLs with real public APIs
    const co2Res = await fetch("https://api.v2.emissions-api.org/api/v2/carbonmonoxide/average.json?country=world&begin=2025-10-01&end=2025-10-30");
    const co2Data = await co2Res.json();
    co2El.textContent = (co2Data[0]?.average?.value * 1e6 || 420).toFixed(1);

    // Example temperature anomaly (dummy fallback)
    const tempRes = await fetch("https://global-warming.org/api/temperature-api");
    const tempData = await tempRes.json();
    tempEl.textContent = (tempData.result?.slice(-1)[0]?.land ?? 1.2).toFixed(2);

    // Simulated energy imbalance data
    energyEl.textContent = (Math.random() * 2 + 0.5).toFixed(2);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
fetchRealData();
setInterval(fetchRealData, 60 * 60 * 1000); // Update hourly







const tickerEl = document.getElementById("news-ticker");

// Public RSS sources (you can switch these)
const FEEDS = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://rss.cnn.com/rss/edition_world.rss",
  "https://www.reutersagency.com/feed/?best-topics=world"
];

// Simple RSS-to-JSON converter API (no key required)
const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

async function fetchNews() {
  try {
    const feedUrl = FEEDS[Math.floor(Math.random() * FEEDS.length)];
    const res = await fetch(RSS_PROXY + encodeURIComponent(feedUrl));
    const data = await res.json();

    const headlines = data.items.slice(0, 10).map(item => item.title);
    const tickerText = headlines.map(h => `<span>${h}</span>`).join(" 🔺 ");
    tickerEl.innerHTML = tickerText;
  } catch (err) {
    console.error("News fetch failed:", err);
    tickerEl.innerHTML = "<span>⚠️ Unable to load news feed.</span>";
  }
}

// Initial load + refresh every 10 minutes
fetchNews();
setInterval(fetchNews, 10 * 60 * 1000);
