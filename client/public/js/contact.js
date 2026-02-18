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

		const formData = new FormData();
		const data = {
			Name: form.Name.value,
			Subject: form.Subject.value,
			FromEmail: form.FromEmail.value,
			Message: form.Message.value,
		};

		const fileInput = form.querySelector('input[name="File"]').files[0];
		if (fileInput) {
			data.FileName = fileInput.name;
			formData.append("files.File", fileInput);
		}

		formData.append("data", JSON.stringify(data));

		fetch(`${apiUrl}/api/emails`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error.message || "Unknown error occurred");
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
