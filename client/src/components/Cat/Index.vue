<template>
	<div class="container">
		<h1>Speaker</h1>
		<div class="create-blog ">
		<p><button v-on:click="navigateTo('/cat/create')" class="btn btn-success btn-sm sizetext">Create</button></p>
		<h4>Speaker In list {{ cats.length }}</h4>
	</div>
		<transition-group name>
			<div v-for="cat in cats" v-bind:key="cat.id" class="blog-list box cafe">
				<!-- <p>id: {{ blog.id }}</p> -->
				<div class="blog-pic">
					<!-- <transition name="fade"> -->
					<div class="thumbnail-pic" v-if="cat.thumbnail != 'null'">
						<img :src="BASE_URL+cat.thumbnail" alt="thumbnail">
					</div>
					<!-- </transition> -->
				</div>
				<h3>{{ cat.brand }}</h3>
				<!-- <div v-html="cat.about.slice(0,200)"></div> -->
				<div class="blog-info">
					<p><strong>model :</strong> {{  }}</p>
					<p><strong>brand :</strong> {{  }}</p>
					<p><strong>watt : </strong> {{ cat.category }}</p>
					<p><strong>power_input :</strong> {{ cat.price }}</p>
					<p><strong>status :</strong></p>
					<p><strong>type :</strong></p>
					<!-- <p>status: {{ blog.status }}</p> -->
					<p>
						<button class="btn btn-sm btn-info" v-on:click="navigateTo('/cat/'+ cat.id)">View
							Blog</button>
						<button class="btn btn-sm btn-warning" v-on:click="navigateTo('/cat/edit/'+ cat.id)">Edit
							blog</button>
						<button class="btn btn-sm btn-danger" v-on:click="deleteCat(cat)">Delete</button>
					</p>
				</div>
				<div class="clearfix"></div>
			</div>
		</transition-group>
	</div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import CatService from "@/services/CatService";
import _ from 'lodash'
import ScrollMonitor from 'scrollMonitor'
let LOAD_NUM = 3
let pageWatcher
export default {
	watch: {
		search: _.debounce(async function (value) {
			const route = {
				name: 'cats'
			}
			if (this.search !== '') {
				route.query = {
					search: this.search
				}
			}
			console.log('search: ' + this.search)
			this.$router.push(route)
		}, 700),
		'$route.query.search': {
			immediate: true,
			async handler(value) {
				this.cats = []
				this.results = []
				this.loading = true
				this.results = (await CatService.index(value)).data
				this.appendResults()
				this.results.forEach(cat => {
					if (this.category.length > 0) {
						console.log(this.category.indexOf(cat.category))
						if (this.category.indexOf(cat.category) === -1) {
							this.category.push(cat.category)
						}
					} else {

						this.category.push(cat.category)
					}
				})
				this.loading = false
				this.search = value
				console.log(this.category)
			}
		}
	},
	data() {
		return {
			cats: [],
			BASE_URL: "http://localhost:8081/assets/uploads/",
			search: '',
			results: [],
			category: [],
			loading: false,
		}
	},
	async created() {
		this.cats = (await CatService.index()).data
	},
	methods: {
		wait(ms) {
			return x => {
				return new Promise(resolve => setTimeout(() => resolve(x), ms));
			};
		},
		appendResults: function () {
			if (this.cat.length < this.results.length) {
				let toAppend = this.results.slice(
					this.cat.length,
					LOAD_NUM + this.cat.length
				)
				this.cat = this.cat.concat(toAppend)
			}
		},
		navigateTo(route) {
			this.$router.push(route)
		},
		async deleteCat(cat) {
			try {
				await CatService.delete(cat)
				this.refreshData()
			} catch (err) {
				console.log(err)
			}
		},
		async refreshData() {
			this.Cat = (await CatService.index()).data
		},
		setCategory(keyword) {
			if (keyword === ' ') {
				this.search = ''
				console.log('null')
			} else {
				this.search = keyword
			}
		},
		async deleteCat(cat) {
			let result = confirm("Want to delete?");
			if (result) {
				try {
					await CatService.delete(cat);
					this.refreshData();
					location.reload();
				} catch (err) {
					console.log(err);
				}
			}
		},
	updated() {
		let sens = document.querySelector('#blog-list-bottom')
		pageWatcher = ScrollMonitor.create(sens)
		pageWatcher.enterViewport(this.appendResults)
	},
	beforeUpdated() {
		if (pageWatcher) {
			pageWatcher.destroy()
			pageWatcher = null
		}
	}
}
}
</script>
<style scoped>
.empty-blog {
	width: 100%;
	text-align: center;
	padding: 10px;
	background: darksalmon;
	color: white;
}
.h6{
	margin-top: 10px;
	margin-bottom: 5px;
}

/* thumbnail */
.thumbnail-pic img {
	width: 200px;
	padding: 5px 10px 0px 0px;
}
.createcafe{
	margin: 10px;
	margin-top: 10px;
	margin-left: 100px;
}
.blog-info {
	float: left;
}

.blog-pic {
	float: left;
}

.clearfix {
	clear: both;
}

.blog-list {
	border: solid 1px #dfdfdf;
	margin-bottom: 10px;
	margin-left: auto;
	margin-right: auto;
	padding: 5px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
}

.blog-header {
	margin-left: auto;
	margin-right: auto;
}

#blog-list-bottom {
	padding-top: 4px;
}

.blog-load-finished {
	padding: 4px;
	text-align: center;
	background: seagreen;
	color: white;
}

.categories {
	margin-top: 10px;
	padding: 0;
	list-style: none;
	float: left;
}

.categories li {
	float: left;
	padding: 2px;
}

.categories li a {
	padding: 5px 10px 5px 10px;
	background: paleturquoise;
	color: black;
	text-decoration: none;
}

.categories li.clear a {
	background: tomato;
	color: white
}

.create-blog {
	margin-top: 10px;
}
.box{
  padding: 5px;
  border: 2px solid gray;

}
.cafe{
	margin-top: 10px;
}
</style>
