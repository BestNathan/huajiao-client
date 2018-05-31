import io from 'socket.io-client'
import store from './store'
import { Notify } from 'quasar'
import { colorForStatus, iconForStatus } from './constants.js'

const url = `http://${window.location.hostname}:3000`

const socket = io(url)
store.state.socket = socket

socket.on('connect_error', error => {
  push({ status: 'fail', message: '服务器连接失败:' + error.message })
  store.state.connected = false
})

socket.on('reconnect', () => {
  push({ status: 'info', message: '服务器重连成功' })
})

socket.on('reconnecting', times => {
  push({ status: 'info', message: `服务器正在重新连接...(${times})` })
})

const push = message => {
  store.state.messages.push(message)
  store.commit('incNewCount')
  if (!store.state.curTabisLog) {
    Notify.create({
      message: message.message,
      timeout: 1000,
      icon: iconForStatus[message.status],
      color: colorForStatus[message.status],
      textColor: 'black',
      position: 'top-right'
    })
  }
}
;['onPause', 'onResume', 'onStopAd'].forEach(event => {
  socket.on(event, message => {
    push(message)
  })
})

socket.on('connect', () => {
  store.state.connected = true
  push({
    status: 'info',
    message: '服务器连接成功'
  })
})

socket.on('disconnect', () => {
  store.state.connected = false
  store.state.started = false
  push({
    status: 'info',
    message: '服务器已断开'
  })
})

socket.on('onCreate', data => {
  if (data.status == 'success') {
    data.message = `创建成功。房间号：${data.roomId}`
  } else {
    data.message = `创建失败。原因：${data.message}`
  }
  push(data)
})

socket.on('onAddad', data => {
  if (data.status == 'success') {
    data.message = '添加成功。当前数量：' + data.count
  } else {
    data.message = `添加失败。原因：${data.message}`
  }
  push(data)
})

socket.on('onStart', roomId => {
  store.state.started = true
  push({
    status: 'info',
    message: '房间：' + roomId + '，开始发送弹幕'
  })
})

socket.on('onStop', reason => {
  store.state.started = false
  let message = reason ? '停止发送。原因：' + reason : '弹幕发送完毕'
  push({
    status: 'info',
    message
  })
})

socket.on('onSendsuccess', obj => {
  push({
    status: 'success',
    message: `发送成功 | ${obj.content}`
  })
})

socket.on('onSendfail', obj => {
  push({
    status: 'fail',
    message: `发送失败 | ${obj.content}`
  })
})
