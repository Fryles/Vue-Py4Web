"use strict";

let app = {};

app.data = {
	data: function () {
		return {
			posts: [],
			new_post_content: "",
			tags: [],
			user_email: null,
		};
	},
	methods: {
		refresh_tags: function () {
			this.tags = [];
			for (let post of this.posts) {
				let tags = extract_tags(post);
				for (let tag of tags) {
					let found = false;
					for (let t of this.tags) {
						if (t.tag == tag) {
							found = true;
							break;
						}
					}
					if (!found) {
						this.tags.push({ tag: tag, active: false });
					}
				}
			}
		},
		add_post: function () {
			fetch(post_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: this.new_post_content,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.post) {
						data.post.hidden = false;
						data.post.owned = true;
						this.posts.push(data.post);
						this.new_post_content = "";
						this.refresh_tags();
					}
				});
		},
		delete_post: function (post) {
			fetch(delete_post_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					post_id: post.id,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (!data.error) {
						let index = this.posts.indexOf(post);
						this.posts.splice(index, 1);
						this.refresh_tags();
					}
				});
		},
		toggle_tag: function (tag) {
			tag.active = !tag.active;
			// refresh hidden property of each post
			let active_tags = this.tags.filter((t) => t.active).map((t) => t.tag);
			if (active_tags.length == 0) {
				for (let post of this.posts) {
					post.hidden = false;
				}
				return;
			}
			for (let post of this.posts) {
				let post_tags = extract_tags(post);
				let hidden = true;
				for (let t of active_tags) {
					if (post_tags.includes(t)) {
						hidden = false;
						break;
					}
				}
				post.hidden = hidden;
			}
		},
		owned: function (post) {
			if (this.user_email == null) {
				return false;
			}
			return post.owner == this.user_email;
		},
	},
};

function extract_tags(post) {
	let tags = [];
	let tag = "";
	let in_tag = false;
	for (let i = 0; i < post.content.length; i++) {
		if (post.content[i] == "#") {
			in_tag = true;
		} else if (in_tag && post.content[i] == " ") {
			in_tag = false;
			tags.push(tag);
			tag = "";
		} else if (in_tag) {
			tag += post.content[i];
		}
	}
	if (in_tag) {
		tags.push(tag);
	}
	return tags;
}

app.get_posts = function () {
	fetch(get_posts_url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			app.vue.posts = data.posts;
			//add hidden property to each post
			for (let post of app.vue.posts) {
				post.hidden = false;
				post.owned = false;
			}
			app.vue.refresh_tags();
			fetch(get_email_url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					app.vue.email = data.email;
					for (let post of app.vue.posts) {
						post.owned = post.email == app.vue.email;
					}
				});
		});
};

app.vue = Vue.createApp(app.data).mount("#app");

app.get_posts();
