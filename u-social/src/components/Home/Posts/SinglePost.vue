<template>
  <div class="card-view">
    <div class="r-layout">
      <div class="r-img cm-sm">
        <img :src="getImage" alt="" />
      </div>
      <div class="r-content">
        <!-- <div class="s-tag">4.3</div> -->
        <h4 class="title">{{ getOwner }}</h4>
        <p class="date-text">{{ getDate }}</p>
        <div class="taglist" v-for="tag in getTags" :key="tag.idTag">
          <div class="tag">{{ tag.etiqueta }}</div>
        </div>
        <p class="color-text" v-if="translated">From {{ from }} to {{ to }}</p>
        <p class="main-text">{{ getText }}</p>
        <p class="color-text" @click="translate()">{{ translateText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SinglePost",
  props: {
    Post: { type: Object, required: true },
  },
  data() {
    return {
      translateText: "Translate Post",
      translated: false,
      originalText: this.Post.text,
      from: "",
      to: "",
    };
  },
  computed: {
    getText: function () {
      return this.originalText;
    },
    getOwner: function () {
      return this.Post.owner;
    },
    getTags: function () {
      return this.Post.tags;
    },
    getDate: function () {
      return this.Post.date;
    },
    getImage: function () {
      return this.Post.image; //
    },
  },
  methods: {
    translate() {
      if (!this.translated) {
        let translateBody = {
          text: this.Post.text,
        };
        this.axios.post("/translate", translateBody).then((response) => {
          this.translateText = "Original Text";
          this.translated = true;
          this.originalText = response.data.message.TranslatedText;
          this.from = response.data.message.SourceLanguageCode.toUpperCase();
          this.to = response.data.message.TargetLanguageCode.toUpperCase();
        });
      } else {
        this.originalText = this.Post.text;
        this.translated = false;
        this.translateText = "Translate Post";
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

.c-container {
  margin: auto;
  width: 93%;
  position: relative;
  z-index: 1;
}

.card-view {
  -webkit-box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 22px;
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
.spacer {
  padding-top: 50px;
  padding-bottom: 50px;
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
  min-width: 199px;
  min-height: 192px;
  max-width: 199px;
  max-height: 192px;
  margin-right: 20px;
}
.cm-sm {
  width: 154px !important;
  height: 156px !important;
}
.r-layout .r-img img {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  -o-object-fit: cover;
  object-fit: cover;
}
.r-layout .s-tag {
  position: absolute;
  top: 0;
  right: 0;
  font-weight: 500;
  margin-right: 0;
}
.s-tag {
  width: 41px;
  height: 36px;
  background: transparent;
  color: #212121;
  border-radius: 3px;
  background: var(--theme-color1);
  text-align: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 20px;
}
.card-sm-content .r-layout .r-content .title {
  font-size: 17px;
}
.r-layout .r-content .title {
  font-size: 22px;
  font-weight: 600;
  color: #dedde5;
  margin: 0;
}

.taglist {
  display: inline-block;
  margin-bottom: 10px;
}
.taglist .tag:first-child {
  margin-left: 0;
}
.taglist .tag {
  margin-left: 10px;
}
.tag:hover {
  background-color: white;
  border: 0.2px solid;
  cursor: pointer;
}

.tag {
  padding-right: 5px;
  padding-left: 5px;
  height: 26px;
  border-radius: 2px;
  background-color: #e4e4e4;
  font-size: 14px;
  color: #666666;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-right: 3px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
}
p {
  font-size: 14px;
  color: #dedde5;
  margin: 0;
  margin-bottom: 10px;
}
.date-text {
  color: #a6a9ad;
}
.main-text {
  font-size: 18px;
}
.r-layout .r-content .color-text {
  font-weight: 600;
  color: #00796b;
}
.color-text:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>