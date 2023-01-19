<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header"></header>
      <div class="menu">
        <a href="#" class="back" @click="close()"
          ><i class="fa fa-angle-left"></i>
          <img :src="getFriendImage" draggable="false"
        /></a>
        <div class="name">{{ this.getChatFriend.nombre }}</div>
      </div>
      <section class="modal-body">
        <ol class="chat" id="chat">
          <li
            v-for="msg of messages"
            :key="msg.message.idUsuario"
            :class="msg.class"
          >
            <div class="msg">
              <div class="user">
                {{ msg.message.nombre }}
              </div>
              <p>{{ msg.message.texto }}</p>
              <time>{{ msg.message.fecha }}</time>
            </div>
          </li>
        </ol>
      </section>

      <footer class="modal-footer">
        <div class="typezone">
          <form>
            <textarea
              type="text"
              v-model="newMessage"
              placeholder="Say something"
            ></textarea
            ><button class="send" value="newMessage" @click="send">
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
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io("http://localhost:3010");
export default {
  name: "ChatWindow",
  emits: ["close"],
  beforeMount() {
    this.getMessages();
  },
  mounted() {
    this.scrollToEnd();
  },
  unmounted() {
    socket.disconnect();
  },
  created() {
    socket.on("chat-message", (data) => {
      let msg = {
        message: {
          idChat: data.idChat,
          idUsuario: data.idUsuario,
          texto: data.texto,
        },
        class: "other",
      };
      this.messages.push(msg);
      this.scrollToEnd();
    });
  },
  props: {
    chatFriend: Object,
    user: Object,
  },
  computed: {
    getChatFriend() {
      return this.chatFriend;
    },
    getFriendImage() {
      return this.chatFriend.imagen_url;
    },
    getUser() {
      return this.user;
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      mySocket: null,
      idChat: -1,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async send(event) {
      event.preventDefault();
      let msg = {
        message: {
          idChat: this.idChat,
          idUsuario: this.user.idUsuario,
          texto: this.newMessage,
        },
        class: "self",
      };
      await this.insertNew(msg, this.messages);
      this.newMessage = "";
      socket.emit("chat-message", msg.message);

      this.scrollToEnd();
    },
    insertNew: async (msg, messages) => {
      messages.push(msg);
      return;
    },
    getMessages() {
      let roomBody = {
        idUsuario1: this.user.idUsuario,
        idUsuario2: this.chatFriend.idUsuario,
      };
      this.axios.post("/room", roomBody).then((response) => {
        if (response.data.created) {
          this.idChat = response.data.idChat;
        } else {
          this.idChat = response.data.idChat;
          for (let i = 0; i < response.data.messages.length; i++) {
            this.pushToArray(response.data.messages[i])
          }
        }
      });
    },

    pushToArray(dbMsg) {
      let msg = {};
      if (dbMsg.Usuario_idUsuario === this.chatFriend.idUsuario) {
        msg = {
          message: {
            idChat: dbMsg.idChat,
            idUsuario: dbMsg.Usuario_idUsuario,
            texto: dbMsg.texto,
          },
          class: "other",
        };
      } else if (dbMsg.Usuario_idUsuario === this.user.idUsuario) {
        msg = {
          message: {
            idChat: dbMsg.idChat,
            idUsuario: dbMsg.Usuario_idUsuario,
            texto: dbMsg.texto,
          },
          class: "self",
        };
      }
      this.messages.push(msg);
    },
    scrollToEnd() {
      var container = this.$el.querySelector(".modal");
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.modal {
  background: #3a3e42;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  width: 400px;
  height: 450px;
}
.modal-header {
  text-align: center;
}
.modal-footer {
  padding: 15px;
  text-align: center;
  display: flex;
}
.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}
.modal-footer {
  margin-top: 70px;
  border-top: 1px solid #eeeeee;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.modal-body {
  margin-top: 20px;
  text-align: center;
  height: 280px;
}

/* M E N U */

.menu {
  position: absolute;
  margin-top: -2px;
  width: 400px;
  height: 50px;
  background: rgba(51, 51, 51, 0.9);
  z-index: 100;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.back {
  position: absolute;
  width: 90px;
  height: 50px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 45px;
  font-size: 40px;
  padding-left: 10px;
  cursor: pointer;
  transition: 0.15s all;
}
.back img {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 100%;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  -ms-border-radius: 100%;
  margin-left: 15px;
}
.back:active {
  background: rgba(0, 0, 0, 0.15);
}
.name {
  position: absolute;
  left: 100px;
  font-family: "Lato";
  font-size: 35px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.98);
  cursor: default;
}

.members {
  position: absolute;
  top: 175px;
  left: 600px;
  font-family: "Lato";
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  cursor: default;
  word-spacing: 2px;
}

/* M E S S A G E S */

.chat {
  list-style: none;
  background: #3a3e42;
  margin: 0;
  padding: 0 0 50px 0;
  margin-top: 60px;
  margin-bottom: 15px;
}
.chat li {
  padding: 0.5rem;
  overflow: hidden;
  display: flex;
}

.other .msg {
  border-top-left-radius: 0px;
  box-shadow: -1px 2px 0px #c1cbcd;
}
.other:before {
  content: "";
  position: relative;
  top: 0px;
  right: 0px;
  left: 0px;
  width: 0px;
  height: 0px;
  border: 5px solid #eef8ff;
  border-left-color: transparent;
  border-bottom-color: transparent;
}

.self {
  justify-content: flex-end;
  align-items: flex-end;
}
.self .msg {
  border-bottom-right-radius: 0px;
  box-shadow: 1px 2px 0px #c1cbcd;
}
.self:after {
  content: "";
  position: relative;
  display: inline-block;
  float: right;
  bottom: 0px;
  right: 0px;
  width: 0px;
  height: 0px;
  border: 5px solid #eef8ff;
  border-right-color: transparent;
  border-top-color: transparent;
  box-shadow: 0px 2px 0px #c1cbcd;
}

.msg {
  background: #eef8ff;
  min-width: 50px;
  padding: 10px;
  border-radius: 2px;
  word-break: break-all;
}
.msg .user {
  font-size: 14px;
  margin: 0 0 2px 0;
  color: #666;
  font-weight: 700;
  margin-top: -2px;
  margin-bottom: 5px;
  transition: all 0.2s ease;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.msg .user .range.admin {
  display: inline-block;
  font-size: 10px;
  font-weight: 300;
  color: #6aea96;
  padding: 2px;
  border-radius: 3px;
  border: solid 1px #6aea96;
  background: rgba(255, 255, 255, 0);
  margin-left: 5px;
}
.msg p {
  font-size: 13px;
  margin: 0 0 2px 0;
  color: #777;
  transition: all 0.2s ease;
}
.msg img {
  position: relative;
  display: block;
  width: 600px;
  border-radius: 5px;
  box-shadow: 0px 0px 3px #eee;
  transition: all 0.8s cubic-bezier(0.565, -0.26, 0.255, 1.41);
  cursor: default;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.msg time {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 3px;
  float: right;
  cursor: default;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.msg time:before {
  content: "\f017";
  color: #ddd;
  font-family: FontAwesome;
  display: inline-block;
  margin-right: 4px;
}

@-webikt-keyframes pulse {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}

::-webkit-scrollbar {
  min-width: 12px;
  width: 12px;
  max-width: 12px;
  min-height: 12px;
  height: 12px;
  max-height: 12px;
  background: #252c33;
  box-shadow: inset 0px 50px 0px rgba(27, 35, 42, 0.9), inset 0px -50px 0px #eee;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 100px;
  border: solid 3px #252c33;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:active {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-button {
  display: block;
  height: 26px;
}

/* T Y P E */
.typezone {
  position: absolute;
  width: 388px;
  margin-bottom: 5px;
  height: 50px;
  z-index: 99;
  background: #fafafa;
  border: none;
  outline: none;
}
textarea,
textarea:hover {
  float: left;
  width: 330px;
  height: 40px;
  z-index: 100;
  background: #fafafa;
  border: none;
  outline: none;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 2%;
  color: #666;
  font-weight: 00;
  font-size: 18px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  resize: none;
  z-index: 200;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.565, -0.26, 0.255, 1.41);
}
textarea:focus {
  width: 340px;
}
.send {
  float: right;
  margin-top: -42px;
  margin-right: -35px;
  width: 100px;
  border: none;
  outline: none;
  z-index: 100;
  cursor: pointer;
  background: none;
}
svg {
  width: 35px;
  height: 35px;
  color: rgb(50, 64, 128);
}
.send:active {
  opacity: 0.85;
}

/* R E S P O N S I V E   C O N F I G U R A T I O N */

@media screen and (max-width: 750px) {
  ::-webkit-scrollbar {
    display: none;
  }
  .chat {
    margin-bottom: 55px;
  }
  .msg p {
    font-size: 11px;
  }
  .msg .user {
    font-size: 13px;
  }
  .msg img {
    width: 300px;
  }
  .chat .notification {
    font-size: 12px;
    margin: 7px 30%;
    width: 40%;
  }
  .chat .day {
    font-size: 11px;
  }

  .send {
    width: 25%;
  }

  textarea {
    left: 0px;
    right: 0px;
    bottom: 50px;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 20px;
    width: 90%;
    border-radius: 0px;
    height: 28px;
    background: #fafafa;
    box-shadow: none;
    transition: all 0.4s cubic-bezier(0.2, -0.2, 0.2, 1.2);
  }
  textarea:focus {
    height: 30vh;
    margin-top: 30vh;
    box-shadow: 0px -20px 20px rgba(0, 0, 0, 0.1);
  }
  form:focus ~ .typezone {
    bottom: 50vh;
  }
}
@media screen and (max-width: 550px) {
  .msg p {
    max-width: 250px;
  }
  .msg img {
    width: 200px;
  }
  .chat .notification {
    font-size: 12px;
    margin: 7px 0px;
    width: 100%;
    border-radius: 0px;
  }
  .chat .notification time {
    right: 10px;
  }
}
</style>