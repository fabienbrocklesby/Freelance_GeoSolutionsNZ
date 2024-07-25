document.addEventListener("DOMContentLoaded", () => {
	const sections = document.querySelectorAll("section[id]");
	const homeLink = document.querySelectorAll(".home-link");
	const aboutLink = document.querySelectorAll(".about-link");
	const servicesLink = document.querySelectorAll(".services-link");
	const projectsLink = document.querySelectorAll(".projects-link");
	const teamLink = document.querySelectorAll(".team-link");
	const publicationsLink = document.querySelectorAll(".publications-link");
	const contactLink = document.querySelectorAll(".contact-link");

	function logVisibleSection() {
		let currentSectionId = "";

		for (const section of sections) {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const scrollY = window.scrollY + window.innerHeight / 2;

			if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
				currentSectionId = section.id;
				break;
			}
		}

		function removeAllHighlights() {
			[
				homeLink,
				aboutLink,
				teamLink,
				servicesLink,
				publicationsLink,
				contactLink,
			].forEach((links) => {
				links.forEach((link) => {
					link.classList.remove("text-primary");
				});
			});
		}

		removeAllHighlights();

		function addHighlight(links) {
			links.forEach((link) => {
				link.classList.add("text-primary");
			});
		}

		if (currentSectionId === "hero") {
			addHighlight(homeLink);
		} else if (currentSectionId === "about") {
			addHighlight(aboutLink);
		} else if (currentSectionId === "services") {
			addHighlight(servicesLink);
		} else if (currentSectionId === "projects") {
			addHighlight(projectsLink);
		} else if (currentSectionId === "team") {
			addHighlight(teamLink);
		} else if (currentSectionId === "publications") {
			addHighlight(publicationsLink);
		} else if (currentSectionId === "contact") {
			addHighlight(contactLink);
		}
	}

	window.addEventListener("scroll", logVisibleSection);
	logVisibleSection();

	const dropdownItems = document.querySelectorAll(".dropdown-content li a");
	const mobileMenu = document.getElementById("mobile-menu");
	const largeAboutMenu = document.getElementById("largeAboutMenu");

	function closeAllDropdowns() {
		const allDetails = document.querySelectorAll("details");
		allDetails.forEach((detail) => {
			if (detail.open) detail.open = false;
		});
	}

	dropdownItems.forEach((item) => {
		item.addEventListener("click", () => {
			closeAllDropdowns();
		});
	});

	document.addEventListener("click", (event) => {
		if (
			!mobileMenu.contains(event.target) &&
			!largeAboutMenu.contains(event.target)
		) {
			closeAllDropdowns();
		}
	});
});
