"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
	data: function () {
		return {
			sightings: [],
		};
	},
	methods: {},
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
	axios.get(sightings_url).then(function (r) {
		app.vue.sightings = r.data.sightings;
	});
};

app.load_data();
