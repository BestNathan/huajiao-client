<template>
  <q-layout id="q-app" view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round aria-label="Menu" icon="live_tv" />

        <q-toolbar-title>
          花椒弹幕广告机
          <div slot="subtitle">该项目仅供学习使用，任何其他使用与作者无关</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <Content />
    </q-page-container>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-show="$store.state.curTabisLog">
      <q-btn round dense color="primary" @click="clearMessages" icon="clear" />
    </q-page-sticky>

    <!-- <q-page-sticky position="bottom-right" :offset="[18, 58]">
      <q-btn round dense color="primary" @click="createAd" icon="check" />
    </q-page-sticky> -->

    <q-page-sticky position="bottom-right" :offset="[18, 58]">
      <q-btn v-back-to-top round dense color="primary" icon="keyboard_arrow_up" />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import Content from './components/Content.vue'

export default {
  name: 'LayoutDefault',
  components: {
    Content
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    clearMessages() {
      this.$store.commit('clearMessages')
    },
    addMessage() {
      this.$store.state.messages.push({ status: 'info', message: 'test' })
    },
    createAd() {
      this.$store.state.socket.emit('create', {
        contents: '主播真漂亮(来自从不说假话的机器人)'
      })
    }
  },
}
</script>

<style>
</style>
