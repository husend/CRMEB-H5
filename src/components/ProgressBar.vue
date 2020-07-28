<template>
  <div class="vue-progress-bar default-theme">
    <div class="vue-progress-bar__tip">
      <span class="vue-progress-bar__tiplabel">{{label}}</span>
      <span class="vue-progress-bar__tiptext">{{text}}</span>
    </div>
    <div class="vue-progress-bar__outer" :style="barbgStyle">

      <div class="vue-progress-bar__inner" :style="barStyle"></div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ProgressBar",
        props: {
            label: String,
            text: String,
            height: {
                type: Number,
                default: 0,
                required: true,
                validator: val => val >= 0
            },
            color: {
                type: String,
                default: ''
            },
            percentage: {
                type: Number,
                default: 0,
                required: true
            }
        },
        computed: {
            barStyle() {
                const style = {};
                style.width = this.percentage + '%';
                style.height = this.height + 'px';
                style.borderRadius = this.height + 'px';
                style.backgroundColor = this.color;
                return style;
            },
            barbgStyle() {
                const style = {};
                style.height = this.height + 'px';
                style.borderRadius = this.height + 'px';
                return style;
            }
        }
    }
</script>

<style lang="scss" scoped>
  .vue-progress-bar.default-theme{
    .vue-progress-bar__outer {
      background: white;
      width: 100%;
    }
  }

  .vue-progress-bar {
    .vue-progress-bar__tiptext {
      float: right;
    }
  }
  .vue-progress-bar__inner {
    animation: bargainSlide 2s;
    -webkit-animation: bargainSlide 2s;
    -moz-animation: bargainSlide 2s;
    -o-animation: bargainSlide 2s;
  }
  @keyframes bargainSlide{
    0% {
      width: 0;
      height: var(height);
      backgroundColor: #eb0000}
    100% {
      width: var(percentage);
      height: var(height);
      backgroundColor: #eb0000
    }
  }
  @-webkit-keyframes bargainSlide{
    0% {
      width: 0;
      height: var(height);
      backgroundColor: #eb0000}
    100% {
      width: var(percentage);
      height: var(height);
      backgroundColor: #eb0000}
  }
  @-moz-keyframes bargainSlide{
    0% {width: 0;height: var(height);backgroundColor: #eb0000}
    100% {width: var(percentage);height: var(height);backgroundColor: #eb0000}
  }
  @-o-keyframes bargainSlide{
    0% {width: 0;height: var(height);backgroundColor: #eb0000}
    100% {width: var(percentage);height: var(height);backgroundColor: #eb0000}
  }
</style>
