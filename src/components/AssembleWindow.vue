<template>
  <div>
  <div class="assemble-window" v-if="assemble.showAssemble">
    <div class="content">
      <div class="title">
        参加<span class="nick">{{assemble.details.userExtVO.nickname}}</span>的拼单
      </div>
      <div class="cutdown" style="display: flex;justify-content: center;align-items: center;">
        仅剩<span style="color: red;display: flex;justify-content: center;align-items: center;">{{assemble.details.lackAssembleNum}}</span>个名额，
        <i><CountDown style="display: flex;justify-content: center;align-items: center;"
            :is-day="false"
            :tip-text="''"
            :day-text="''"
            :hour-text="':'"
            :minute-text="':'"
            :second-text="''"
            :datatime="Date.parse(assemble.details.stopTime)/1000"
          ></CountDown></i>后结束
      </div>
      <div class="close iconfont icon-guanbi" @click="closeAttr"></div>
    </div>
    <ul class="image-ul">
      <li class="assemer-li" :style="'background: url(' + assemble.details.userExtVO.headImgUrl + ') 0% 0% / 100% 100%;'">
      </li>
      <li class="member-li"></li>
    </ul>
    <div class="assemble-button">
      <button @click="toAssemble">参与拼单</button>
    </div>
  </div>
  <div
    class="mask" style="z-index: 998"
    @touchmove.prevent
    :hidden="assemble.showAssemble === false"
    @click="closeAttr"
  ></div>
  </div>
</template>
<script>
    import CountDown from "@components/CountDown";
    export default {
      name: "AssembleWindow",
      components: {
          CountDown
      },
      props: {
        assemble: {
            type: Object,
            default: () => {}
        }
      },
      data: function() {
        return {

        };
      },
      mounted: function() {},
      methods: {
        closeAttr: function () {
            this.$emit("changeFun", {action: "changeassemble", value: false});
        },
        toAssemble: function () {
            this.$emit("changeFun", {action: "changeassemble", value: false});
            this.$emit("changeFun", {action: "toAssemble", value: true, data: this.assemble.details});
        }
      }
    }
</script>

<style>
  .assemble-window {
    position: absolute;
    bottom: 35%;
    right: 10%;
    z-index: 999;
    background-color: #fff;
    width: 80%;
    height: 4.3rem;
    margin: auto;
    border-radius: .08rem;
  }
  .content {
    padding-top: 0.5rem;
    text-align: center;
    position: relative;
  }
  .title {
    font-size: 19px;
    color: #000;
    line-height: 1;
  }
  .nick {
    display: inline-block;
    max-width: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    text-align: left;
  }
  .cutdown {
    font-size: 14px;
    margin-top: 0.16rem;
    padding: 0 1rem;
    color: #58595b;
    /*text-align: center;*/
  }
  .close {
    width: 0.32rem;
    height: 0.32rem;
    position: absolute;
    top: -.145rem;
    right: -.145rem;
    border-radius: .145rem;
    font-size: .1rem;
    color: #9c9c9c;
    background-color: #e0e0e0;
    text-align: center;
    line-height: .31rem;
  }
  .close:after {
    /*content: "\E61D";*/
    font-size: 0.26rem;
    color: #666;
    font-family: icomoon;
    line-height: 1;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  .image-ul {
    padding: 0.34rem 0.2rem 0 .2rem;
    height: 1.3rem;
    box-sizing: content-box;
    text-align: center;
  }
  ol, ul {
    list-style: none;
  }
  .assemer-li {
    border: 1px solid #ffc635;
  }
  .member-li {
    border: 1px dashed #ccc;
    background-position: 50%;
    background-size: .11rem .17rem;
  }
  .member-li, .assemer-li{
    width: 0.98rem;
    height: 0.98rem;
    border-radius: 50%;
    display: inline-block;
    margin: 0 .06rem;
  }
  .member-li img, .assemer-li img{
    width: 0.88rem;
    height: 0.8rem;
    border-radius: 50%;
    display: inline-block;
    margin: 0 .06rem;
  }
  .assemble-button {
    height: 1.5rem;
    padding: 0 0.5rem 0.2rem  0.5rem;
    text-align: center;
  }
  .assemble-button button{
    width: 100%;
    height: 65%;
    color: #fff;
    font-size: 0.35rem;
    padding: .09rem 0;
    text-align: center;
    background-color: #e02e24;
    border-radius: .05rem;
    margin-top: .01rem;
    position: relative;
  }
</style>
