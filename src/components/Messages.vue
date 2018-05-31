<template>
    <div>
        <div v-show="showList">
            <q-list highlight>
                <q-item v-for="item in items" :key="item.$index">
                    <q-item-side>
                        <q-item-tile :icon="iconForStatus[item.status]" :color="colorForStatus[item.status]" />
                    </q-item-side>
                    <q-item-main :label="item.message" />
                </q-item>
            </q-list>
        </div>
        <div v-show="!showList">
            没有日志记录
        </div>
    </div>
</template>
<script>
import { colorForStatus, iconForStatus } from '../constants.js'

export default {
  name: 'Messages',
  data() {
    return {
      colorForStatus: {},
      iconForStatus: {}
    }
  },
  computed: {
    items() {
      return this.$store.state.messages
    },
    showList() {
      return !!this.$store.state.messages.length
    }
  },
  mounted() {
    this.colorForStatus = colorForStatus
    this.iconForStatus = iconForStatus
  }
}
</script>
