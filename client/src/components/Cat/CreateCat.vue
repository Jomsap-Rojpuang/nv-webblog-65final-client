<template>
  <div class="container createcat box">
    <h1>Speaker</h1>

    <form v-on:submit.prevent="createCat">
      <p>Model : <input type="text" v-model="cat.brand" /></p>
      <transition name="fade">
		<div class="thumbnail-pic" v-if="cat.thumbnail != 'null'">
			<img :src="BASE_URL + cat.thumbnail" alt="thumbnail" />
		</div>
	  </transition>
      <form enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="
              filesChange($event.target.name, $event.target.files);
              fileCount = $event.target.files.length;
            "
            accept="image/*"
            class="input-file"
          />
          <!-- <p v-if="isInitial || isSuccess"> -->
          <p v-if="isInitial">
            Drag your file(s) here to begin<br />
            or click to browse
          </p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          <p v-if="isSuccess">Upload Successful.</p>
          <p v-if="isFailed">Upload Failed.</p>
        </div>
        <div>
          <ul class="pictures">
            <li v-for="picture in pictures" v-bind:key="picture.id">
              <img
                style="margin-bottom: 5px"
                :src="BASE_URL + picture.name"
                alt="picture image"
              />
              <button v-on:click.prevent="delFile(picture)">Delete</button>
			  <button v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
      </form>
      <p><strong>Brand :</strong></p>
      <p>
        <vue-ckeditor
          v-model.lazy="cat.about"
          :config="config"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        />
      </p>

      <p>watt : <input type="number" v-model="cat.category" /></p>
      <p>power_input : <input type="number" v-model="cat.price" /></p>
      <p>status : <input type="text" /></p>
      <p>type : <input type="text" /></p>
      <p><button type="submit">Create</button></p>
    </form>
  </div>
</template>
<script>
import CatService from "@/services/CatService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "@/services/UploadService";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
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
        height: 300,
      },
    };
  },
  methods: {
    async createCat() {
      try {
        this.cat.pictures = JSON.stringify(this.pictures);
        await CatService.post(this.cat);
        this.$router.push({
          name: "cats",
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
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      // this.uploadedFiles = []
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach((uploadFilename) => {
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
              name: uploadFilename,
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
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name,
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
	useThumbnail(filename){
		console.log(filename)
		this.cat.thumbnail = filename
	}
  },
  created() {
    this.reset();
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
    },
  },
  components: {
    VueCkeditor,
  },
};
</script>
<style scoped>.dropbox {
	outline: 2px dashed grey;
	/* the dash box */
	outline-offset: -10px;
	background: rgb(198, 195, 171);
	color: rgb(0, 0, 0);
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
	/* when mouse over to the drop zone, change color
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

.createcat {
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
