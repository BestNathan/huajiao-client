<template>
  <div>
    <q-field v-show="supported && canPlay" class="row q-ma-sm">
      <div class="videoContainer">
        <video class="centeredVideo" id="huajiao" playsinline controls autoplay>"对不起该浏览器暂不支持最新的HTML5特性，请使用现代浏览器."</video>
      </div>
      <q-btn-group class="full-width">
        <q-btn color="primary" class="full-width" label="重新加载" @click="load" icon="autorenew" />
        <q-btn color="primary" class="full-width" label="开始播放" @click="play" icon="play_arrow" />
        <q-btn color="primary" class="full-width" label="暂停播放" @click="pause" icon="pause" />
      </q-btn-group>
    </q-field>
    <q-field v-show="!supported" label="该设备暂不支持，无法播放直播">
    </q-field>
    <q-field v-show="!canPlay" label="未获取到播放地址，请先创建弹幕机">
    </q-field>
  </div>
</template>
<script>
export default {
  name: 'videoHuajiao',
  data() {
    return {
      ele: null,
      player: null,
      isHls: false,
      isFlv: false
    }
  },
  computed: {
    hasFlv() {
      return !!this.$store.state.flv
    },
    hasHls() {
      return !!this.$store.state.hls
    },
    supported() {
      return this.isHls || this.isFlv
    },
    canPlay() {
      return (this.isHls && this.hasHls) ||(this.isFlv && this.hasFlv)
    }
  },
  methods: {
    load() {
      if (this.isFlv) {
        return this.loadFlv()
      }
      if (this.isHls) {
        return this.loadHls()
      }
    },
    play() {
      if (this.isFlv) {
        return this.playFlv()
      }
      if (this.isHls) {
        return this.playHls()
      }
    },
    pause() {
      if (this.isFlv) {
        return this.pauseFlv()
      }
      if (this.isHls) {
        return this.pauseHls()
      }
    },
    destroy() {
      if (this.isFlv) {
        return this.destroyFlv()
      }
      if (this.isHls) {
        return this.destroyHls()
      }
    },
    loadHls() {
      this.pauseHls()
      this.ele.src = ''
      this.isHls && (this.ele.src = this.$store.state.hls, this.playHls())
    },
    playHls() {
      this.isHls && this.ele.play()
    },
    pauseHls() {
      this.isHls && this.ele.pause()
    },
    destroyHls() {
      this.isHls && (this.ele.src = '')
    },
    loadFlv() {
      if (!this.isFlv || !this.hasFlv) {
        return
      }
      this.destroyFlv()
      this.player = this.$flv.createPlayer(
        {
          type: 'flv',
          url: this.$store.state.flv,
          hasAudio: true,
          hasVideo: true,
          isLive: true
        },
        {
          enableWorker: true,
          lazyLoadMaxDuration: 3 * 60,
          seekType: 'range'
        }
      )
      this.player.attachMediaElement(this.ele)
      this.player.load()
    },
    playFlv() {
      this.player.play()
    },
    pauseFlv() {
      this.player.pause()
    },
    destroyFlv() {
      if (!this.player) {
        return
      }
      this.player.unload()
      this.player.detachMediaElement()
      this.player.destroy()
      this.player = null
    }
  },
  mounted() {
    this.ele = document.getElementById('huajiao')
    if (this.ele.canPlayType('application/vnd.apple.mpegurl')) {
      this.isHls = true
      this.load()
    } else {
      import(/* webpackChunkName: "flv" */ 'flv.js').then(flv => {
        this.$flv = flv.default
        this.isFlv = this.$flv.isSupported()
        this.load()
      })
    }
  }
}
</script>
<style scoped>
.videoContainer {
  display: table;
  margin: 0 auto;
}
.centeredVideo {
  height: 100%;
  width: 100%;
}
</style>
