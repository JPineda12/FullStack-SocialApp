<template>
  <div class="card-view">
    <div class="r-layout">
      <div class="imagen">
        <div :class="newPost.image === '' ? 'r-img dashed' : 'r-img cm-sm'">
          <img v-if="newPost.image != ''" :src="newPost.image" alt="" />
        </div>
        <div class="upload">
          <label class="custom-file-upload">
            <input type="file" @change="handlePhoto" accept="image/*" />
            <svg
              id="fileIcon"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </label>
        </div>
      </div>

      <div class="r-content">
        <!-- <div class="s-tag">4.3</div> -->
        <h4 class="title">{{ newPost.owner }}</h4>

        <textarea
          placeholder="Remember, be nice!"
          v-model="newPost.text"
        ></textarea>
        <div class="card-bts">
          <button class="bt-post" @click="publicar">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
            <a> Publicar</a>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "CreatePost",
  emits: ["posted"],
  props: {
    User: { type: Object, required: true },
    Tags: { type: Array, required: true },
  },
  data() {
    return {
      newPost: {
        idPost: 1,
        text: "",
        image: "",
        owner: this.User.username,
        tags: [],
        date: "",
      },
    };
  },
  computed: {
    getUser: function () {
      return this.User;
    },
  },
  methods: {
    handlePhoto(event) {
      const file = event.target.files[0];
      let extension = file.name.split(".", 2)[1].toLowerCase();
      if (extension === "png" || extension === "jpg" || extension === "jpeg") {
        this.createBase64Image(file);
      } else {
        Swal.fire("Error - Tipo de archivo no admitido", "", "error");
      }
    },
    createBase64Image(fileObject) {
      var reader = new FileReader();
      reader.onload = (e) => {
        //this.imagenBase64 = e.target.result;
        this.newPost.image = e.target.result;
      };
      reader.readAsDataURL(fileObject);
    },
    async publicar(event) {
      event.preventDefault();
      if (this.newPost.image === "") {
        Swal.fire("Error - El post debe incluir una imagen", "", "error");
      } else {
        var today = new Date();
        this.newPost.date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        let compatible_base64 = this.newPost.image.split(",")[1];
        let lambdaBody = {
          imagen: compatible_base64,
        };

        this.axios
          .post(
            "/detect-etiquetas",
            lambdaBody
          )
          .then(async (response) => {
            for await (let label of response.data.result) {
              //BUSCAR SI YA EXISTE EL TAG EN LA BASE DE DATOS
              let idTag = -1;
              let existeTag = this.Tags.find((obj) => {
                // Returns the object where
                // the given property has some value
                return obj.Etiqueta.toLowerCase() === label.Name;
              });
              idTag = existeTag ? existeTag.idEtiqueta : -1;
              if (existeTag === null || existeTag === undefined) {
                //Ingresar este tag en la base de datos
                this.axios
                  .post("/new-tag", { tag: label.Name })
                  .then((resx) => {
                    idTag = resx.data.idTag;
                    let st = {
                      tag: label.Name,
                      idTag: idTag,
                    };
                    this.newPost.tags.push(st);
                  });
              }
            }
            //INSERTAR NEW POST ON PUBLICACION TABLE
            this.axios
              .post("/new-post", {
                imagen: compatible_base64,
                texto: this.newPost.text,
                idUser: this.User.idUsuario,
              })
              .then(async (resp) => {
                this.newPost.idPost = resp.data.idPost;
                for await (let newTagPost of this.newPost.tags) {
                  this.axios
                    .post("/post-tags", {
                      idTag: newTagPost.idTag,
                      idPublicacion: this.newPost.idPost,
                    })
                    .then(() => {
                      
                    });
                }
                this.$emit("posted", this.newPost);
                this.newPost.tags = [];
                this.newPost = {
                  idPost: 1,
                  text: "",
                  image: "",
                  owner: this.User.username,
                  tags: [],
                  date: "",
                };
              });
          });
      }
    },
  },
};
</script>

<style scoped>
:root {
  --dark-green: #9cc675;
  --dark-yellow: #e89a3d;
  --extra-light-brown: #fdf0d7;
  --light-brown: #ecd5ab;
  --dark-brown: #915b40;
  --light-yellow: #f8e3a8;
  --light-red: #f3ac99;
  --light-teal: #a6c8cc;
  --light-gray: #ddd5d6;
  --theme-color2: #e89a3d;
  --theme-color1: #e89a3d;
}

.card-view {
  -webkit-box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 22px;
  height: 160px;
  margin-bottom: 20px;
  background: #242526;
}
.flex-row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.bg-gray {
  background: #f8f8f8;
}
.no-margin {
  margin: 0 !important;
}
.flex-row .flex-col {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}
.r-layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
}
.r-layout .r-img {
  position: relative;
  min-width: 139px;
  min-height: 132px;
  max-width: 139px;
  max-height: 132px;
  margin-right: 20px;
}
.cm-sm {
  width: 154px !important;
  height: 156px !important;
  border-radius: 20px;
}
.dashed {
  width: 154px !important;
  height: 156px !important;
  border-radius: 20px;
  border: 3px dashed rgb(99, 99, 99);
}
.r-layout .r-img img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  -o-object-fit: cover;
  object-fit: cover;
}

.card-sm-content .r-layout .r-content .title {
  font-size: 17px;
}
.r-layout .r-content .title {
  font-size: 22px;
  font-weight: 600;
  color: #dedde5;
  margin-bottom: 2px;
}
.title {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.r-layout .r-content p {
  font-size: 14px;
  color: #dedde5;
  margin: 0;
  margin-bottom: 10px;
}
.r-layout .r-content p {
  font-size: 14px;
  color: #dedde5;

  margin: 0;
  margin-bottom: 10px;
}

textarea {
  width: 600px;
  height: 50px;
  border: 3px solid #cccccc;
  padding: 5px;
  font-family: Tahoma, sans-serif;

  background-position: bottom right;
  background-repeat: no-repeat;
  resize: none;
}

.custom-file-upload {
  appearance: none;
  outline: 0;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 18px;
  transition-duration: 0.25s;
}
.upload {
  margin-left: 25%;
}
button:hover {
  background-color: #dedde5;
  cursor: pointer;
}

svg {
  width: 30px;
  height: 30px;
}
#fileIcon {
  color: white;
}
input[type="file"] {
  display: none;
}

.bt-post {
  background-color: white;
  width: 100px;
  height: 35px;
  text-align: center;
  border: 2px solid;
  border-radius: 5px;
  display: inline-block;
  box-sizing: border-box;
  padding-bottom: 0px;
  padding-top: 0px;
  line-height: 30px;
}

.bt-post a {
  position: relative;
  top: -25%;
  margin-top: 20px;
  line-height: 30px;
}
</style>