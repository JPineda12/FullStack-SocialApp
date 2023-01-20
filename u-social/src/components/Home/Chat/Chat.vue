<template>
  <div class="container">
    <div class="friends-list">
      <div
        id="user-request"
        v-for="user of Friends"
        :key="user.idUsuario"
        class="card-top"
        @click="openChat(user)"
      >
        <div class="card-image">
          <img :src="user.imagen_url" />
        </div>
        <div class="card-text">
          <h2>{{ user.nombre }}</h2>
        </div>
      </div>
    </div>
    <ChatWindow
      v-if="isChatVisible"
      :chatFriend="chatFriend ? chatFriend : ''"
      :user="user ? user : ''"
      @close="closeChat()"
    />
  </div>
</template>

<script>
import ChatWindow from "./ChatWindow.vue";
export default {
  name: "Chat",
  components: {
    ChatWindow,
  },
  data() {
    return {
      Friends: [],
      chatFriend: {},
      isChatVisible: false,
      user: {},
    };
  },
  beforeMount() {
    let us = localStorage.getItem("user-info");
    this.user = JSON.parse(us);    
    this.getFriends();
  },
  methods: {
    getFriends() {
      this.axios
        .get(`/friends/${this.user.idUsuario}`)
        .then((response) => {
          for (let i = 0; i < response.data[0].length; i++) {
            let us = {
              idUsuario: response.data[0][i].idUsuario,
              nombre: response.data[0][i].username,
              imagen_url: response.data[0][i].img_url,
              //"https://www.naruto-guides.com/wp-content/uploads/2019/05/sakura-haruno.jpg",
            };
            this.Friends.push(us);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openChat(friend) {
      this.chatFriend = friend;
      this.isChatVisible = true;
    },
    closeChat() {
      this.isChatVisible = false;
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #18191a;
  width: 100%;
  height: 1000px;
}
.friends-list {
  display: table;
  margin-left: 10%;
}
.card-top:hover {
  opacity: 0.3;
  filter: alpha(opacity=30);
  background-color: rgb(114, 104, 104);
  cursor: pointer;
}

svg {
  width: 22px;
  height: 22px;
  position: relative;
  z-index: 10;
  overflow: hidden;
}
svg:hover {
  fill: white;
}
#user-info,
#user-request {
  display: inline-table;
  margin-top: 10px;
  margin-left: 10px;
}
.card-top,
.card-right,
.card-bottom,
.card-left {
  display: flex;
  flex-wrap: nowrap;
  width: 20%;
  border-radius: 95.2380952381px;
  box-shadow: 0px 3px 9px 1px rgba(0, 10, 20, 0.2);
  align-items: center;
  align-content: center;
}
.card-top {
  flex-direction: column;
  grid-column: auto / span 1;
  grid-row: auto / span 2;
  background: #242526;
}
.card-image {
  display: flex;
}
.card-image img {
  width: 200px;
  height: 300px;
  object-fit: cover;
}
.card-top img {
  border-radius: 95.2380952381px 95.2380952381px 0 0;
}
.card-text h2 {
  align-content: center;
  color: #dedde5;
  margin-left: 25%;
}
.card-top .card-text {
  height: auto;
  width: auto;
  padding-bottom: 36.8px;
}
.card-text button {
  margin-left: 18%;
}
@media (max-width: 200px) {
  .card-top {
    flex-direction: row;
    grid-column: auto / span 2;
    grid-row: auto / span 1;
  }
  .card-bottom {
    flex-direction: row-reverse;
    grid-column: auto / span 2;
    grid-row: auto / span 1;
  }
  .card-top .card-image,
  .card-bottom .card-image {
    height: 100%;
    width: 50%;
  }
  .card-top img {
    border-radius: 95.2380952381px 0 0 95.2380952381px;
  }
  .card-bottom img {
    border-radius: 0 95.2380952381px 95.2380952381px 0;
  }
  .card-top .card-text {
    height: auto;
    width: 50%;
    padding-right: 36.8px;
  }
  .card-bottom .card-text {
    height: auto;
    width: 50%;
    padding-left: 36.8px;
  }
}
@media (max-width: 200px) {
  .card-image {
    width: 38% !important;
  }
  .card-text {
    width: 62% !important;
  }
}
.card-text,.card-top{
  min-height: 50px;
}
</style>