<template>
  <div class="container">
    <CreatePost
      class="create"
      :User="User"
      :Tags="Tags"
      @posted="newPost($event)"
    />
    <FilterList class="filter" :Tags="Tags" @filter="findPosts($event)" />
    <div class="post-list" v-for="post of FilteredPosts" :key="post.idPost">
      <SinglePost :Post="post" />
    </div>
  </div>
</template>

<script>
import SinglePost from "./SinglePost";
import CreatePost from "./CreatePost";
import FilterList from "./FilterList";
export default {
  name: "Posts",
  components: {
    SinglePost,
    CreatePost,
    FilterList,
  },
  data() {
    return {
      Posts: [],
      FilteredPosts: [],
      Tags: [],
      User: {},
    };
  },
  beforeMount() {
    let us = localStorage.getItem("user-info");
    this.User = JSON.parse(us);
    this.getTags();
    this.getPosts();
    this.FilteredPosts = this.Posts;
  },
  methods: {
    getTags() {
      this.Tags = [];
      this.Tags.push({
        idTag: 0,
        Etiqueta: "Todos",
      });
      this.axios.get("/tags").then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.Tags.push(response.data[i]);
        }
      });
    },
    async findPosts(nombreEtiqueta) {
      this.FilteredPosts = [];
      if (nombreEtiqueta.toLowerCase() === "todos") {
        this.FilteredPosts = this.Posts;
      } else {
        for await (let p of this.Posts) {
          for (let x = 0; x < p.tags.length; x++) {
            let tag = p.tags[x];
            if (tag.etiqueta.toLowerCase() === nombreEtiqueta.toLowerCase()) {
              this.FilteredPosts.push(p);
              break;
            }
          }
        }
      }
    },
    newPost(post) {
      console.log("new: ",post);
      this.getTags();
      this.getPosts();
      this.FilteredPosts = this.Posts;      
    },
    getPosts() {
      this.Posts = [];
      this.axios
        .get(`/posts`)
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            let sp = {
              idPost: response.data[i].publicacion.idPublicacion,
              owner: response.data[i].publicacion.owner,
              image: response.data[i].publicacion.url_imagen,
              text: response.data[i].publicacion.texto,
              date: "2017-12-12",
              tags: response.data[i].etiquetas,
            };
            this.Posts.push(sp);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #18191a;
}
</style>