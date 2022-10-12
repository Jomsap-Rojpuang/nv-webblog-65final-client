<template>
	<div class="container box">
		<div class="blog-pic">
		<p class="h1 center">{{ cat.brand }} </p>
		</div>
		<div class="blog-info">
		<div v-html="cat.about.slice()"></div>
		<p>category: {{ cat.category }}</p>
		<p>Price: {{ cat.price }}</p>

			<button v-on:click="navigateTo('/cat/edit/' + cat.id)" class="btn btn-warning">
				แก้ไข blog
			</button>
			<button v-on:click="navigateTo('/cats')" class="btn btn-danger">กลับ</button>
		</div>
	</div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import CatService from "@/services/CatService";
export default {
	data() {
		return {
			cat: null,
		};
	},
	async created() {
		try {
			let catId = this.$route.params.catId;
			this.cat = (await CatService.show(catId)).data;
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		navigateTo(route) {
			this.$router.push(route);
		},
	},
};
</script>
<style scoped>
.createcat{
	margin: 10px;
	margin-top: 10px;
	margin-left: 100px;
}
.center{
	text-align: center;
	}
.box{
  padding: 10px;
  border: 2px solid gray;

}
</style>