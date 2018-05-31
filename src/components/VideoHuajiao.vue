<template>
  <div>
    <q-field v-show="supported && hasFlv" class="row q-ma-sm">
      <div class="videoContainer">
        <video class="centeredVideo" id="huajiao" controls autoplay>"对不起该浏览器暂不支持最新的HTML5特性，请使用现代浏览器."</video>
      </div>
      <q-btn-group class="full-width">
        <q-btn color="primary" class="full-width" label="重新加载" @click="loadFlv" icon="autorenew" />
        <q-btn color="primary" class="full-width" label="开始播放" @click="playFlv" icon="play_arrow" />
        <q-btn color="primary" class="full-width" label="暂停播放" @click="pauseFlv" icon="pause" />
      </q-btn-group>
    </q-field>
    <q-field v-show="!supported" label="该设备不支持MSE，无法播放直播，请使用PC端访问">
    </q-field>
    <q-field v-show="!hasFlv" label="未获取到Flv播放地址，请先创建弹幕机">
    </q-field>
  </div>
</template>
<script>
export default {
  name: 'videoHuajiao',
  data() {
    return {
      ele: null,
      supported: false,
      player: null
    }
  },
  computed: {
    hasFlv() {
      return this.$store.state.flv != ''
    }
  },
  methods: {
    loadFlv() {
      if (!this.supported || !this.hasFlv) {
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
    import(/* webpackChunkName: "flv" */'flv.js').then(flv => {
      this.$flv = flv.default
      this.ele = document.getElementById('huajiao')
      this.supported = this.$flv.isSupported()
      this.loadFlv()
    })
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
