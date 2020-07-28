<template>
  <div id="wrapper" :style="styleObject">
<!--    <video tabindex="-1"></video>-->
  </div>
</template>
<script>
import ChimeeMobilePlayer from 'chimee-mobile-player';
import chimeePluginMobileControlbar from 'chimee-plugin-mobile-controlbar';
import localStorage from '@utils/store/localStorage'
export default {
    props: {
      playData: {
          type: Object,
          default: () => {

          }
      },
      nowNo: {
        type: String,
        default: ''
      }
    },
    data () {
        return {
          chimee: {},
          styleObject: {
            position: 'relative',
            display: 'block',
            backgroundColor: '#000',
            width: '',
            height: ''
          }
        }
    },
    watch: {
        playData: function (val) {
            this.chimee.load(this.playData.url[1])
        }
    },
    methods: {
      initVideo() {
          let $this = this
          ChimeeMobilePlayer.install(chimeePluginMobileControlbar);
          this.chimee = new ChimeeMobilePlayer({
              wrapper: '#wrapper',
              src: this.playData.url[1],
              noDefaultContextMenu: true,
              plugins: [
                  {
                      name: chimeePluginMobileControlbar.name,
                      children: {
                          play: {},
                          currentTime: {},
                          totalTime: {},
                          progressBar: {},
                          // volume: {},
                          // clarity: {
                          //     list: [
                          //         {name: '超清', src: this.playData.url[1]},
                          //         {name: '高清', src: this.playData.url[0]}
                          //     ],
                          //     immediate: true,
                          //     width: '4em'
                          // },
                          // playbackrate: {
                          //     list: [
                          //         {name: '0.5', value: 0.5},
                          //         {name: '1.0', value: 1, default: true},
                          //         {name: '2.0', value: 2}
                          //     ]
                          // },
                          screen: {}
                      }
                  }
              ],
              autoplay: false,
              controls: true,
              playsInline: true,
              preload: 'auto',
              x5VideoPlayerFullscreen: true,
              x5VideoOrientation: 'landscape|portrait',
              xWebkitAirplay: true,
              muted: false,
          });
          this.chimee.on('loadedmetadata', function(){
              if (this.duration !== (localStorage.get($this.nowNo)*1)) {
                this.currentTime = (localStorage.get($this.nowNo)*1)
              }
          })
          this.chimee.on('timeupdate', function(){
              if (this.currentTime > 0) {
                  localStorage.set($this.nowNo, this.currentTime)
              }
          })
          this.chimee.on('pause', function(){

          })
      }
    },
    mounted: function () {
        // debugger
        let box = this.$parent.$refs.videobox
        box.style.backgroundImage = ''
        // box.style.backgroundColor = 'black'
        this.styleObject.width = box.offsetWidth + 'px'
        this.styleObject.height = box.offsetHeight > 600 ? (box.offsetHeight - 9) + 'px' : box.offsetHeight + 'px'
        this.initVideo()
    },
    updated: function() {

    }
}
</script>
<style lang="scss" scoped>
  container {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
  #wrapper {
    height: 100%;
    /*position: relative;*/
    /*width: 1110px;*/
    /*height: 624px;*/
    /*display: block;*/
    /*background-color: #000;*/
  }
</style>
