function normalizeBaseUrl(value, fallback = "") {
  const base = value || fallback;
  return base.replace(/\/$/, "");
}

const API_URL = normalizeBaseUrl(import.meta.env.PUBLIC_API_URL, "http://localhost:1337");
const IMAGE_URL = normalizeBaseUrl(import.meta.env.PUBLIC_IMAGE_URL, API_URL);
const FILE_URL = normalizeBaseUrl(import.meta.env.PUBLIC_FILE_URL, IMAGE_URL);

async function fetchAPI(endpoint) {
  try {
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");
    const response = await fetch(`${API_URL}/api/${normalizedEndpoint}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_URL}${path}`;
}

function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${FILE_URL}${path}`;
}

export { fetchAPI, getImageUrl, getFileUrl, API_URL, IMAGE_URL, FILE_URL };
