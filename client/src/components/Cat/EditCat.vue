<template>
	<div class="container createcafe box">
		<p class="h1">Edit Speaker</p>
		<form v-on:submit.prevent="editCat">
			<label>model</label>
			<input type="text" v-model="cat.brand" />
			<label>brand</label>
			<input type="text" v-model="cat.brand" />
			<label>watt</label>
			<input type="text" v-model="cat.category" />
			<label>power_input</label>
			<input type="text" v-model="cat.price" />
			<label>status</label>
			<input type="text" v-model="cat.price" />
			<label>typet</label>
			<input type="text" v-model="cat.price" />
			<p>
				<button type="submit" class="btn btn-success createuser">Update</button>
				<button v-on:click="navigateTo('/cats')" class="btn btn-warning createuser">กลับ</button>
			</p>
		</form>
	</div>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import CatService from "@/services/CatService";
import VueCkeditor from "vue-ckeditor2";
export default {
	data() {
		return {
			cat: {
				brand: "",
				thumbnail: "null",
				pictures: "null",
				about: "",
				category: "",
				price: "",
			},
			config: {
				toolbar: [
					{
						name: "document",
						items: [
							"Source",
							"-",
							"Save",
							"NewPage",
							"Preview",
							"Print",
							"-",
							"Templates",
						],
					},
					{
						name: "clipboard",
						items: [
							"Cut",
							"Copy",
							"Paste",
							"PasteText",
							"PasteFromWord",
							"-",
							"Undo",
							"Redo",
						],
					},
					{
						name: "editing",
						items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
					},
					{
						name: "forms",
						items: [
							"Form",
							"Checkbox",
							"Radio",
							"TextField",
							"Textarea",
							"Select",
							"Button",
							"ImageButton",
							"HiddenField",
						],
					},
					"/",
					{
						name: "basicstyles",
						items: [
							"Bold",
							"Italic",
							"Underline",
							"Strike",
							"Subscript",
							"Superscript",
							"-",
							"CopyFormatting",
							"RemoveFormat",
						],
					},
					{
						name: "paragraph",
						items: [
							"NumberedList",
							"BulletedList",
							"-",
							"Outdent",
							"Indent",
							"-",
							"Blockquote",
							"CreateDiv",
							"-",
							"JustifyLeft",
							"JustifyCenter",
							"JustifyRight",
							"JustifyBlock",
							"-",
							"BidiLtr",
							"BidiRtl",
							"Language",
						],
					},
					{ name: "links", items: ["Link", "Unlink", "Anchor"] },
					{
						name: "insert",
						items: [
							"Image",
							"Flash",
							"Table",
							"HorizontalRule",
							"Smiley",
							"SpecialChar",
							"PageBreak",
							"Iframe",
							"InsertPre",
						],
					},
					"/",
					{ name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
					{ name: "colors", items: ["TextColor", "BGColor"] },
					{ name: "tools", items: ["Maximize", "ShowBlocks"] },
					{ name: "about", items: ["About"] },
				],
				height: 300
			}
		};
	},
	methods: {
		async editCat() {
      try {
        await CatService.put(this.cat);
        this.$router.push({
          name: "cats"
        });
      } catch (err) {
        console.log(err);
      }
    },
    navigateTo(route) {
      console.log(route);
      this.$router.push(route);
    },
    wait(ms) {
      return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
    //   // reset form to initial state
    //   this.currentStatus = STATUS_INITIAL;
    //   // this.uploadedFiles = []
    //   this.uploadError = null;
    //   this.uploadedFileNames = [];
    },
    async save(formData) {
      // upload data to the server
      try {
        // this.currentStatus = STATUS_SAVING;
        // await UploadService.upload(formData);
        // this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach(uploadFilename => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFilename) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.pictureIndex++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename
            };
            this.pictures.push(pictureJSON);
          }
        });

        this.clearUploadResult();
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    clearUploadResult: function() {
      setTimeout(() => this.reset(), 5000);
    },
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name
        };
        await UploadService.delete(dataJSON);
        for (var i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.materialIndex--;
            break;
          }
        }
      }
    },
    useThumbnail(filename) {
      console.log(filename);
      this.cat.thumbnail = filename;
    }
  },
  async created() {
    this.reset();
    try {
      let catId = this.$route.params.catId;
      this.cat = (await CatService.show(catId)).data;
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  components: {
    VueCkeditor
  }
};
</script>
<style scoped>
.dropbox {
	outline: 2px dashed grey;
	/* the dash box */
	outline-offset: -10px;
	background: lemonchiffon;
	color: dimgray;
	padding: 10px 10px;
	min-height: 100px;
	/* minimum height */
	position: relative;
	cursor: pointer;
}

.input-file {
	opacity: 0;
	/* invisible but it's there! */
	width: 100%;
	height: 200px;
	position: absolute;
	cursor: pointer;
}

.dropbox:hover {
	background: khaki;
	/* when mouse ov-er to the drop zone, change color
    */
}

.dropbox p {
	font-size: 1.2em;
	text-align: center;
	padding: 50px 0;
}

ul.pictures {
	list-style: none;
	padding: 0;
	margin: 0;
	float: left;
	padding-top: 10px;
	padding-bottom: 10px;
}

ul.pictures li {
	float: left;
}

ul.pictures li img {
	max-width: 10px;
	margin-right: 20px;
}

.clearfix {
	clear: both;
}

.thumbnail-pic img {
	width: 200px
}

.box {
	padding: 5px;
	border: 2px solid gray;

}

.cafe {
	margin-top: 10px;
}

.createcafe {
	margin: 10px;
	margin-top: 10px;
	margin-left: 100px;
}

input[type=text],
select {
	width: 100%;
	padding: 12px 20px;
	margin: 8px 0;
	display: inline-block;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
}

input[type=password],
select {
	width: 100%;
	padding: 12px 20px;
	margin: 8px 0;
	display: inline-block;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
}

input[type=submit] {
	width: 100%;
	background-color: #4CAF50;
	color: white;
	padding: 14px 20px;
	margin: 8px 0;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

input[type=submit]:hover {
	background-color: #45a049;
}

div {
	border-radius: 5px;
	background-color: #f2f2f2;
	padding: 20px;
}

label {
	font-size: 20px;
	margin-left: 10px;
}

.createuser {
	margin-top: 20px;
}
</style>
