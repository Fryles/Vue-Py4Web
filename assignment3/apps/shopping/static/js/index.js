"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};
var random_items = [
	"Apples",
	"Bananas",
	"Carrots",
	"Potatoes",
	"Oranges",
	"Pineapples",
	"Mangos",
	"Grapes",
	"Strawberries",
	"Blueberries",
	"Raspberries",
	"Blackberries",
	"Watermelon",
	"Cantaloupe",
	"Honeydew",
	"Lemons",
	"Limes",
	"Peaches",
	"Plums",
	"Pears",
	"Cherries",
];
app.data = {
	data: function () {
		return {
			new_item_name: "",
			shopping_items: [],
		};
	},
	methods: {
		add_item: function (event) {
			console.log(this.shopping_items);
			if (this.new_item_name === "") {
				let new_name =
					random_items[Math.floor(Math.random() * random_items.length)];
				this.new_item_name = new_name;
			}
			this.shopping_items.push({
				id: -1,
				item_name: this.new_item_name,
				purchased: "no",
			});
			this.new_item_name = "";
			console.log(this.shopping_items);
		},
		delete_item: function (index) {
			console.log("deleting item at index: ", index);
			this.shopping_items.splice(index, 1);
		},
	},
};

app.load_data = function () {
	fetch("/shopping/load_data", {
		method: "GET",
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Yikes");
		})
		.then((data) => {
			// data is the response from the server
			console.log(data);
			// add the items to the list
			app.vue.shopping_items = data.data;
		})
		.catch((error) => {
			console.error("failed to get data: ", error);
		});
};

// This is the initial data load.
app.load_data();

//watch items for changes
app.watch = {
	shopping_items: {
		deep: true,
		handler: function (new_items, old_items) {
			// send a post to update_items endpoint
			// the endpoint will not change with app name change
			fetch("/shopping/update_items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					items: new_items,
				}),
			})
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error("Network response was not ok.");
				})
				.then((data) => {
					// data is the response from the server
					console.log(data);
				})
				.catch((error) => {
					console.error("failed to post a new item: ", error);
				});
		},
	},
};

app.vue = Vue.createApp(app.data).mount("#app");
