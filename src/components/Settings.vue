<template>
  <div>
    <q-field icon-color="primary" icon="home" helper="请输入房间号，留空为随机">
      <q-input float-label="房间号" clearable inverted v-model="roomId" :after="[{
      icon: 'arrow_forward',
      content: true,
      handler () {
        openURL(roomLink)
      }
    },{
      icon: 'replay',
      content: true,
      handler () {
        roomId = lastRoomId
      }
    }]" />
    </q-field>
    <q-field icon-color="primary" icon="timer" helper="请输入时间间隔，最低10S">
      <q-input float-label="时间间隔" type="number" inverted @blur="onTimerBlur" v-model="interval" suffix="秒" />
    </q-field>
    <q-field icon-color="primary" icon="send" helper="请输入发送次数，最低10次">
      <q-input float-label="发送次数" type="number" inverted @blur="onTimesBlur" v-model="times" suffix="次" />
    </q-field>
    <p></p>
    <q-field icon-color="primary" icon="message" helper="弹幕消息，换行符分割，一行一句">
      <q-input type="textarea" clearable inverted :max-height="textareaHeight" v-model="content" />
    </q-field>
    <p></p>
    <q-field icon-color="primary" icon="settings" helper="弹幕模式，轰炸机模式仅限至尊特权会员">
      <q-radio v-model="mode" val="normal" label="普通模式&nbsp;" />
      <q-radio v-model="mode" val="fakechat" label="假聊模式&nbsp;" />
      <q-radio v-model="mode" val="bomb" label="轰炸机模式&nbsp;" disable />
    </q-field>
    <p></p>
    <q-field icon-color="primary" icon="play_arrow" helper="弹幕机操作">
      <q-btn-group class="full-width">
        <q-btn color="primary" class="full-width" label="创建" @click="onCreateClick" icon="create" :disabled="!canCreate" />
        <q-btn color="primary" class="full-width" label="暂停" @click="onPauseClick" icon="pause" />
        <q-btn color="primary" class="full-width" label="继续" @click="onResumeClick" icon="replay" />
        <q-btn color="primary" class="full-width" label="停止" @click="onStopClick" icon="stop" />
      </q-btn-group>
    </q-field>
  </div>
</template>
<script>
import { openURL, Dialog } from 'quasar'

const showError = message => {
  return Dialog.create({
    title: '提示',
    message,
    color: 'primary',
    ok: true
  })
}

export default {
  name: 'Settings',
  data() {
    return {
      textareaHeight: 100,
      canCreate: true,
      roomId: '',
      interval: undefined,
      times: undefined,
      mode: 'normal',
      contents: [],
      content: '',
      lastRoomId: ''
    }
  },
  computed: {
    disabled() {
      return !this.$store.state.connected
    },
    roomLink() {
      return 'http://www.huajiao.com/l/' + this.roomId
    }
  },
  watch: {
    content(val) {
      let contents = val.split('\n').filter(a => a)
      this.contents = contents
    },
    roomId(newVal, oldVal) {
      if (oldVal) {
        this.lastRoomId = oldVal
      }
    }
  },
  methods: {
    openURL,
    onTimerBlur() {
      this.interval && (this.interval = this.interval < 10 ? 10 : this.interval)
    },
    onTimesBlur() {
      this.times && (this.times = this.times < 10 ? 10 : this.times)
    },
    onCreateClick() {
      this.createAd()
    },
    onPauseClick() {
      this.pauseAd()
    },
    onResumeClick() {
      this.resumeAd()
    },
    onStopClick() {
      this.stopAd()
    },
    createAd() {
      if (!this.$store.state.connected) {
        return showError('服务器未连接,请检查网络或等待连接...')
      }
      let { roomId, interval, times, mode, contents } = this
      interval && (interval *= 1000)
      if (!contents.length) {
        return showError('弹幕内容不能为空,请重新填写...')
      }
      this.$store.state.socket.emit('create', { roomId, interval, times, mode, contents })
    },
    pauseAd() {
      if (!this.$store.state.started) {
        return
      }
      this.$store.state.socket.emit('pause', this.roomId)
    },
    resumeAd() {
      if (this.$store.state.started) {
        return
      }
      this.$store.state.socket.emit('resume', this.roomId)
    },
    stopAd() {
      this.$store.state.socket.emit('stopAd', this.roomId)
    }
  },
  mounted() {
    this.content = '主播真漂亮'
    this.$store.state.socket.on('onCreate', data => {
      if (data.status == 'success') {
        this.roomId = data.roomId
        this.$store.state.flv = `http://qh0-flv.live.huajiao.com/live_huajiao_v2/${data.sn}.flv`
        this.$store.state.hls = `http://qh0-hls.live.huajiao.com/live_huajiao_v2/${data.sn}/index.m3u8`
        this.canCreate = false
      }
    })
    this.$store.state.socket.on('onStop', reason => {
      if (!reason || reason === 'stop') {
        this.canCreate = true
        //this.$store.state.flv = ''
        //this.$store.state.hls = ''
      }
    })
  }
}
</script>
