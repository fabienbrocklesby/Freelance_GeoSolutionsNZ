const API_URL = import.meta.env.PUBLIC_API_URL;
const IMAGE_URL = import.meta.env.PUBLIC_IMAGE_URL;

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`);
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

export { fetchAPI, getImageUrl, API_URL, IMAGE_URL };
