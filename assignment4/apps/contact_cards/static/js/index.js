"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
	data: function () {
		return {
			contacts: [],
		};
	},
	methods: {
		add_contact: function () {
			let form = document.getElementById("add_contact_form");
			let form_data = new FormData(form);
			let post_data = {};
			form_data.forEach(function (value, key) {
				post_data[key] = value;
			});
			fetch("/contact_cards/add_contact", {
				method: "POST",
				body: JSON.stringify(post_data),
			})
				.then((response) => response.json())
				.then((data) => {
					app.vue.contacts.push(data.contact);
					console.log(data.contact);
				});
		},
	},
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
	fetch("/contact_cards/get_contacts", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => {
			app.vue.contacts = data.contacts;
			console.log(data.contacts);
		});
};

app.load_data();
