const API_URL = (import.meta.env.PUBLIC_API_URL || "http://localhost:1337").replace(
	/\/$/,
	""
);

export async function GET({ site }) {
	const siteUrl = site || "https://geosolutions.nz";

	const staticUrls = [
		{ loc: `${siteUrl}/`, priority: "1.0" },
		{ loc: `${siteUrl}/about`, priority: "0.8" },
		{ loc: `${siteUrl}/services`, priority: "0.8" },
		{ loc: `${siteUrl}/projects`, priority: "0.8" },
		{ loc: `${siteUrl}/publications`, priority: "0.7" },
	];

	let dynamicUrls = [];

	try {
		const projectsResponse = await fetch(`${API_URL}/api/projects`);
		if (projectsResponse.ok) {
			const projectsData = await projectsResponse.json();
			dynamicUrls = projectsData.data.map((project) => ({
				loc: `${siteUrl}/projects/${project.id}`,
				priority: "0.7",
			}));
		}
	} catch (error) {
		console.error("Failed to fetch projects for sitemap:", error);
	}

	const allUrls = [...staticUrls, ...dynamicUrls];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
	.map(
		({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
	)
	.join("\n")}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}
