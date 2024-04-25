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
		add_item: function () {
			if (this.new_item_name === "") {
				let new_name =
					random_items[Math.floor(Math.random() * random_items.length)];
				this.new_item_name = new_name;
			}
			this.shopping_items.push({
				id: -(this.shopping_items.length + 1),
				item_name: this.new_item_name,
				purchased: "no",
				checked: false,
			});
			this.new_item_name = "";
			this.sort_items();
			app.send_data();
		},
		delete_item: function (item) {
			console.log("deleting item: ", item);
			this.shopping_items = this.shopping_items.filter((i) => i !== item);
			app.send_data();
		},
		purchase_item: function (item) {
			console.log("purchasing item: ", item);
			//set purchased according to checked
			// NOT SURE WHY I HAVE TO INVERT CHECKED
			// VUE SLOW IG?? IT WORKS THO
			if (!item.checked) {
				item.purchased = "yes";
				item.checked = true;
			} else {
				item.purchased = "no";
				item.checked = false;
			}
			app.send_data();

			this.sort_items();
		},
		bandaid: function () {
			//this is bad
			//but it works
			this.shopping_items.forEach((item) => {
				if (item.purchased == "yes") {
					item.checked = true;
				} else {
					item.checked = false;
				}
			});
		},
		sort_items: function () {
			//sort by id first
			this.shopping_items.sort((a, b) => {
				if (a.id < b.id) {
					return -1;
				} else if (a.id > b.id) {
					return 1;
				} else {
					return 0;
				}
			});
			this.shopping_items.sort((a, b) => {
				if (a.purchased < b.purchased) {
					return -1;
				} else if (a.purchased > b.purchased) {
					return 1;
				} else {
					return 0;
				}
			});
			setTimeout(() => {
				this.bandaid();
			}, 1);
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
			//set checked for all items
			data.data.forEach((item) => {
				if (item.purchased === "yes") {
					item.checked = true;
				} else {
					item.checked = false;
				}
			});
			// add the items to the list
			app.vue.shopping_items = data.data;
			console.log(app.vue.shopping_items);
			//sort items by purchased
			app.vue.shopping_items.sort((a, b) => {
				if (a.purchased < b.purchased) {
					return -1;
				} else if (a.purchased > b.purchased) {
					return 1;
				} else {
					return 0;
				}
			});
		})
		.catch((error) => {
			console.error("failed to get data: ", error);
		});
};

app.send_data = function () {
	fetch("/shopping/update_items", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			items: this.vue.shopping_items,
		}),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Network response was not ok.");
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("failed to post a new item: ", error);
		});
};

// This is the initial data load.
app.load_data();

//watch items for changes
app.data.watch = {};

app.vue = Vue.createApp(app.data).mount("#app");
