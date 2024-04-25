"use strict";

let app = {};

function sumFromIndex(arrays, index, fs) {
	let sum = 0;
	for (let i = index; i >= 0; i--) {
		sum += arrays[i][fs];
	}
	return sum;
}

var rates = [
	[10, 0, 0],
	[12, 11000, 22000],
	[22, 44725, 89450],
	[24, 95375, 190750],
	[32, 182100, 364200],
	[35, 231250, 462500],
	[37, 578125, 693750],
	[420, Infinity, Infinity],
];

app.data = {
	data: function () {
		return {
			value1: 0,
			value2: 0,
			value3: 0,
			value4: 0,
			value5: 0,
			value6: 0,
			value7: 0,
			value8: 0,
			value9: 0,
			value10: 0,
			value11: 0,
			value12: 0,
			value13: 0,
			value14: 0,
			check5: false,
			// end of input values
		};
	},
	methods: {
		compute() {
			this.value4 = this.value1 + this.value2 + this.value3;
			this.value5 = this.check5 ? 27700 : 13850;
			this.value6 = this.value4 - this.value5;
			if (this.value6 < 0) {
				this.value6 = 0;
			}
			this.value9 = this.value7 + this.value8;
			this.value10 = this.taxcalc(this.value6);
			this.value12 = this.value10 + this.value11;
			if (this.value9 > this.value12) {
				this.value13 = this.value9 - this.value12;
			} else {
				this.value13 = 0;
			}
			if (this.value12 > this.value9) {
				this.value14 = this.value12 - this.value9;
			} else {
				this.value14 = 0;
			}
		},
		taxcalc(totalincome) {
			if (totalincome <= 0) {
				return 0;
			}
			let filingstatus = this.check5 ? 2 : 1;
			let tax = 0;
			let taxable = totalincome;
			for (let i = 0; i < rates.length; i++) {
				if (totalincome > rates[i + 1][filingstatus]) {
					taxable = rates[i + 1][filingstatus] - rates[i][filingstatus];
					tax += taxable * (rates[i][0] / 100);
					// console.log("beyond bound " + i + " Tax: " + tax);
					// console.log("taxable: " + taxable);
				} else {
					tax += (totalincome - rates[i][filingstatus]) * (rates[i][0] / 100);
					// console.log("ending in bound " + i + " Tax: " + tax);
					break;
				}
			}
			return tax;
		},
	},
	watch: {
		value1: function () {
			this.compute();
		},
		value2: function () {
			this.compute();
		},
		value3: function () {
			this.compute();
		},
		check5: function () {
			this.compute();
		},
		value7: function () {
			this.compute();
		},
		value8: function () {
			this.compute();
		},
		value11: function () {
			this.compute();
		},
	},
};

app.vue = Vue.createApp(app.data).mount("#app");
app.vue.compute();
