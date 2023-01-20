<template>
  <div class="container">
    <div class="friends-list">
      <div
        id="user-request"
        v-for="user of Requests"
        :key="user.idUsuario"
        class="card-top"
      >
        <div class="card-image">
          <img :src="user.imagen_url" />
        </div>
        <div class="card-text">
          <h2>{{ user.nombre }}</h2>
          <button class="btn-accept" @click="acceptRequest(user)">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            <a>Accept Request</a>
          </button>
          <button class="btn-reject" @click="rejectRequest(user)">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            <a>Reject Request</a>
          </button>
        </div>
      </div>

      <div
        id="user-info"
        v-for="user of Users"
        :key="user.idUsuario"
        class="card-top"
      >
        <div class="card-image">
          <img :src="user.imagen_url" />
        </div>
        <div class="card-text">
          <h2>{{ user.nombre }}</h2>
          <button
            class="btn-gr"
            @click="addFriend(user)"
            :disabled="user.isSent"
          >
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            <a>{{ user.buttonText }}</a>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "Users",
  data() {
    return {
      Users: [],
      Requests: [],
    };
  },
  beforeMount() {
    let us = localStorage.getItem("user-info");
    this.User = JSON.parse(us);
    this.getRequests();
    this.getUsuarios();
  },

  methods: {
    getRequests() {
      this.axios
        .get(`/requests/${this.User.idUsuario}`)
        .then((response) => {
          for (let i = 0; i < response.data[0].length; i++) {
            let us = {
              idUsuario: response.data[0][i].idUsuario,
              nombre: response.data[0][i].username,
              //response.data[i].img_url,
              imagen_url:response.data[0][i].img_url,
            };
            this.Requests.push(us);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getUsuarios() {
      this.axios
        .get(`/users/${this.User.idUsuario}`)
        .then((response) => {
          for (let i = 0; i < response.data[0].length; i++) {
            let existeUser = this.Users.find((obj) => {
              // Returns the object where
              // the given property has some value
              return obj.nombre.toLowerCase() === response.data[0][i].username;
            });
            if (existeUser === null || existeUser === undefined) {
              let us = {
                idUsuario: response.data[0][i].idUsuario,
                nombre: response.data[0][i].username,
                buttonText: "Add Friend",
                isSent: false,
                //response.data[i].img_url,
                imagen_url:
                  response.data[0][i].img_url,
              };
              if (response.data[0][i].estado.toUpperCase() === "PENDIENTE") {
                us.buttonText = "Request Sent";
                us.isSent = true;
                this.Users.push(us);
              } else {
                this.Users.push(us);
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addFriend(newFriend) {
      console.log("idAmigo1: ", this.User.idUsuario);
      console.log("idAmigo2: ", newFriend.idUsuario);
      const toast = useToast();
      toast.success("¡Solicitud de amistad enviada!", {
        position: "bottom-left",
        timeout: 2000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false,
      });
      newFriend.isSent = true;
      newFriend.buttonText = "Request Sent";
      let requestBody = {
        idAmigo1: this.User.idUsuario,
        idAmigo2: newFriend.idUsuario,
      };
      this.axios
        .post("send-request", requestBody)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
    acceptRequest(newFriend) {
      console.log("idAmigo1: ", newFriend.idUsuario);
      console.log("idAmigo2: ", this.User.idUsuario);
      let requestBody = {
        idAmigo1: newFriend.idUsuario,
        idAmigo2: this.User.idUsuario,
      };
      this.axios
        .put("confirm", requestBody)
        .then((response) => {
          console.log(response);
          const toast = useToast();
          toast.success("¡Solicitud Aceptada!", {
            position: "bottom-left",
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false,
          });
          const index = this.Requests.indexOf(newFriend);
          if (index > -1) {
            this.Requests.splice(index, 1);
          }
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
    rejectRequest(newFriend) {
      console.log("idAmigo1: ", newFriend.idUsuario);
      console.log("idAmigo2: ", this.User.idUsuario);
      let requestBody = {
        idAmigo1: newFriend.idUsuario,
        idAmigo2: this.User.idUsuario,
      };
      this.axios
        .put("reject", requestBody)
        .then((response) => {
          console.log(response);
          const toast = useToast();
          toast.warning("¡Solicitud Rechazada!", {
            position: "bottom-left",
            timeout: 2000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false,
          });
          const index = this.Requests.indexOf(newFriend);
          if (index > -1) {
            this.Requests.splice(index, 1);
          }
          newFriend.buttonText = "Add Friend";
          newFriend.isSent = false;
          this.Users.push(newFriend);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #18191a;
}

button {
  appearance: none;
  outline: 0;
  background-color: white;
  border: 0;
  padding: 5px 15px;
  margin-left: 10px;
  color: #000000;
  border-radius: 13px;
  width: 70%;
  cursor: pointer;
  font-size: 95%;
  transition-duration: 0.25s;
}

button:hover {
  background-color: #48e455;
}

.friends-list {
  display: table;
  margin-left: 15%;
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
  width: 25%;
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
  margin-left: 10%;
}
.card-top .card-text {
  height: auto;
  width: auto;
  overflow: hidden;
  padding-bottom: 36.8px;
}
.card-text button {
  margin-left: 18%;
}

#user-request button {
  width: 120px;
  margin-bottom: 5px;
  margin-left: 20%;
}
.btn-accept:hover {
  background-color: rgb(0, 255, 13);
}

.btn-reject:hover {
  background-color: rgb(255, 14, 14);
}
button[disabled] {
  pointer-events: none;
  background-color: rgb(97, 97, 97);
}
.card-text,
.card-top {
  min-height: 200px;
}
</style>