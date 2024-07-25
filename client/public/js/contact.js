document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("contactForm");
	const loading = document.getElementById("loadingSpinner");
	const successMessage = document.getElementById("successMessage");
	const errorMessage = document.getElementById("errorMessage");
	const apiUrl = window.apiUrl;

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		loading.classList.remove("hidden");
		form.querySelector("div button").classList.add("btn-disabled");

		const formData = new FormData(form);
		const data = {
			Name: formData.get("Name"),
			Subject: formData.get("Subject"),
			FromEmail: formData.get("FromEmail"),
			Message: formData.get("Message"),
		};

		const payload = {
			data: data,
		};

		fetch(`${apiUrl}/api/emails`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				loading.classList.add("hidden");
				form.querySelector("div button").classList.remove("btn-disabled");
				successMessage.classList.remove("hidden");
				form.reset();
			})
			.catch((error) => {
				console.error("Error:", error);
				errorMessage.classList.remove("hidden");
				loading.classList.add("hidden");
				form.querySelector("div button").classList.remove("btn-disabled");
			});
	});
});
