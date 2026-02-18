const getRobotsTxt = (sitemapURL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`;

export async function GET({ site }) {
	const sitemapURL = new URL("sitemap-index.xml", site);
	return new Response(getRobotsTxt(sitemapURL.href), {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
