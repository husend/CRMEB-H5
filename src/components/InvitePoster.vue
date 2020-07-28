<template>
  <div v-if="posterImageStatus" class="poster-first">
    <div class="poster-pop" v-show="!canvasStatus">
      <div class="canvas" ref="poster" id="posterHtml"> <!--    :style="'background-image:url('+posterData.image+')'"-->
        <img class="image" :src="posterData.image" alt="商品图片"/>
<!--        <div class="text black">-->
<!--          <span v-text="posterData.title"></span>-->
<!--        </div>-->
        <!--        <div class="text rad">-->
        <!--          <span v-text="'￥' + posterData.price"></span>-->
        <!--        </div>-->
        <div class="code">
          <div class="code-img">
            <div id="qrcodeImg"></div>
          </div>
        </div>
        <div class="head">
          <div class="head-img">
            <img :src="posterData.headImg"/>
          </div>
        </div>
      </div>
      <!--<div class="save-poster" @click="savePosterPath">生成图片</div>-->
    </div>
    <div class="poster-pop" v-show="canvasStatus">
      <img :src="posterImage" alt="tp" class="poster-image" />
      <div class="keep">长按图片可以保存到手机</div>
    </div>
    <div class="mask" @click="posterImageClose"></div>
  </div>
</template>
<script>
    import html2canvas from "html2canvas";
    import QRCode from 'qrcodejs2';
    import { mapGetters } from "vuex";
    export default {
        name: "InvitePoster",
        props: {
            posterImageStatus: Boolean,
            posterData: Object
        },
        data: function() {
            return {
                canvasStatus: false,
                posterImage: ''
            };
        },
        watch: {
            posterImageStatus: function() {
                let that = this;
                that.canvasStatus = false;
                if (that.posterImageStatus === true) {
                    that.$nextTick(function() {
                        that.createQrcode(location.href);
                        that.savePosterPath();
                    });
                }
            }
        },
        mounted: function() {},
        computed: {
            ...mapGetters(["userInfo"])
        },
        methods: {
            posterImageClose: function() {
                // this.posterImageStatus = false;

                this.$emit("setPosterImageStatus");
            },
            savePosterPath: function() {
                this.$dialog.loading.open();
                this.setHtml2Canvas();
            },
            setHtml2Canvas: function() {
                let that = this;
                const domObj = document.getElementById('posterHtml')
                html2canvas(domObj, {
                    logging: false,
                    useCORS: true,//允许跨域图片
                    letterRendering: true,
                    onclone(doc) {
                        let e = doc.querySelector('#posterHtml')
                        e.style.display = 'block'
                    }
                }).then(function(canvas) {
                    // 在微信里,可长按保存或转发
                    that.canvasStatus = true;
                    that.posterImage = canvas.toDataURL('image/png')
                    that.$dialog.loading.close();
                })
                //   let that = this;
                //   const canvas = document.createElement("canvas");
                //   let canvasBox = that.$refs.poster;
                //   const width = parseInt(window.getComputedStyle(canvasBox).width);
                //   const height = parseInt(window.getComputedStyle(canvasBox).height);
                //   canvas.width = width * 4;
                //   canvas.height = height * 4;
                //   canvas.style.width = width + "px";
                //   canvas.style.height = height + "px";
                //   const context = canvas.getContext("2d");
                //   context.scale(2, 2);
                //   const options = {
                //       backgroundColor: null,
                //       canvas,
                //       useCORS: true
                //   };
                //   html2canvas(canvasBox, options).then(function(canvas) {
                //       that.posterImage = canvas.toDataURL();
                //       that.canvasStatus = true;
                //       that.$dialog.loading.close();
                //   }).catch(err => {
                //       alert(err)
                //   });
            },
            createQrcode(text) {
                // 生成二维码
                const qrcodeImgEl = document.getElementById('qrcodeImg')
                qrcodeImgEl.innerHTML = ''
                let qrcode = new QRCode(qrcodeImgEl, {
                    width: 50,
                    height: 50,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                })
                qrcode.makeCode(text)
            }
        }
    };
</script>
<style scoped>
  .poster-first {
    overscroll-behavior: contain;
  }
  .poster-pop {
    width: 70%;
    height: 70%;
    position: fixed;
    z-index: 100;

    top:42%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .poster-pop .canvas {
    background-color: #ffffff;
    height: 9.8rem;
    z-index: 101;
  }
  .poster-pop .poster-image {
    width: 100%;
    height: 100%;
  }
  .poster-pop .canvas .image {
    width: 100%;
    height: 100%;
    display: block;
  }
  .poster-pop .canvas .code {
    width: 100%;
    height: 1.05rem;
    /*display: inline-flex;*/
    position: relative;
    z-index: 102;
    bottom: 17%;
  }
  .poster-pop .canvas .code .code-img {
    width: 100%;
    height: 100%;
    margin-left: 73%;
  }
  .poster-pop .canvas .head {
    width: 100%;
    /*display: inline-flex;*/
    position: relative;
    z-index: 102;
    bottom: 106.5%;
  }
  .poster-pop .canvas .head .head-img {
    width: 100%;
    height: 100%;
    margin-left: 5%;
  }
  .poster-pop .canvas .head .head-img img{
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
  }
  .poster-pop .keep {
    color: #fff;
    text-align: center;
    font-size: 0.25rem;
    margin-top: 0.1rem;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
</style>
