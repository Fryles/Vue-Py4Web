"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
	data: function () {
		return {
			contacts: [],
			name: "",
			affiliation: "",
			desc: "",
		};
	},
	methods: {
		add_contact: function () {
			let contact = {
				name: this.name,
				affiliation: this.affiliation,
				desc: this.desc,
			};
			console.log("adding: " + contact.name);
			fetch("/contact_cards/add_contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				}, 
				body: JSON.stringify(contact),
			}).then((data) => {
				console.log(data);
			});
		},
		delete_contact: function (item) {},
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
