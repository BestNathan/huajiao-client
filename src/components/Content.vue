<template>
  <q-page>
    <q-tabs two-lines align="center">
      <!-- Tabs - notice slot="title" -->
      <q-tab label="操作设置" slot="title" name="tab-1" icon="settings" default @select="onSelected('setting')" />
      <q-tab label="日志记录" slot="title" name="tab-2" icon="message" :count="count" @select="onSelected('log')" />
      <q-tab label="观看直播" slot="title" name="tab-3" icon="movie" @select="onSelected('video')" />

      <!-- Targets -->
      <q-tab-pane id="settings" name="tab-1" keep-alive>
        <Settings/>
      </q-tab-pane>
      <q-tab-pane id="messages" name="tab-2" keep-alive>
        <Messages/>
      </q-tab-pane>
      <q-tab-pane id="huajiaoVideo" name="tab-3" keep-alive>
        <VideoFlv ref="videoFlv" />
      </q-tab-pane>
    </q-tabs>
  </q-page>
</template>
<script>
import Settings from './Settings.vue'
import Messages from './Messages.vue'
import VideoFlv from './VideoHuajiao.vue'

export default {
  name: 'Content',
  components: {
    Settings,
    Messages,
    VideoFlv
  },
  computed: {
    count() {
      return this.$store.state.newCount
    }
  },
  methods: {
    onSelected(type) {
      switch (type) {
        case 'setting':
          this.$store.state.curTabisLog = false
          this.$refs.videoFlv && this.$refs.videoFlv.destroyFlv()
          break
        case 'log':
          this.$store.state.curTabisLog = true
          this.$store.commit('clearNewCount')
          this.$refs.videoFlv && this.$refs.videoFlv.destroyFlv()
          break
        case 'video':
          this.$store.state.curTabisLog = false
          this.$refs.videoFlv && this.$refs.videoFlv.loadFlv()
      }
    }
  }
}
</script>
