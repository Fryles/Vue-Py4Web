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
			image: "",
			imageUrl: "https://bulma.io/assets/images/placeholders/96x96.png",
		};
	},
	methods: {
		add_contact: function () {
			let contact = {
				name: this.name,
				affiliation: this.affiliation,
				desc: this.desc,
				image: this.image,
				id: -this.contacts.length,
			};
			if (contact.image === "") {
				contact.image = "https://bulma.io/assets/images/placeholders/96x96.png";
				contact.imageUrl =
					"https://bulma.io/assets/images/placeholders/96x96.png";
			}
			//clear fields
			this.name = "";
			this.affiliation = "";
			this.desc = "";
			this.imageUrl = "https://bulma.io/assets/images/placeholders/96x96.png";
			this.image = "";
			this.contacts.push(contact);
			fetch("/contact_cards/add_contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(contact),
			}).then((data) => {
				data.json().then((data) => {
					console.log(data);
					contact.id = data.id;
				});
			});
		},
		delete_contact: function (item) {
			console.log("deleting: " + item.name);
			this.contacts = this.contacts.filter((contact) => contact.id !== item.id);
			fetch("/contact_cards/delete_contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(item),
			}).then((data) => {
				console.log(this.contacts);
				console.log(data);
			});
		},
		uploadImage: function (e, contact = null) {
			const file = e.target.files[0];
			// get dataurl
			let dataurl = null;
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				dataurl = e.target.result;
				if (!contact) {
					this.imageUrl = URL.createObjectURL(file);
					this.image = dataurl;
				} else {
					contact.imageUrl = URL.createObjectURL(file);
					contact.image = dataurl;
					//update contacts locally
					for (let i = 0; i < this.contacts.length; i++) {
						if (this.contacts[i].id === contact.id) {
							this.contacts[i].image = contact.image;
						}
					}
					this.save_input(contact);
				}
			};
		},
		save_input: function (contact) {
			//save input to server
			fetch("/contact_cards/edit_contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(contact),
			}).then((data) => {
				console.log(data);
			});
		},
		click_figure: function (e) {
			//get input element
			let input = e.target.nextElementSibling;
			//click the input element
			input.click();
		},
		toggleReadonly: function (e) {
			e.preventDefault();
			let input = e.target;
			input.toggleAttribute("readonly");
		},
	},
};

app.load_data = function () {
	fetch("/contact_cards/get_contacts", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => {
			app.vue.contacts = data.contacts;
			console.log(app.vue.contacts);
		});
};

app.vue = Vue.createApp(app.data).mount("#app");
app.load_data();
