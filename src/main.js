import Vue from 'vue'
import App from './App.vue'

import './styles/quasar.styl'
import lang from 'quasar-framework/i18n/zh-hans'
import 'quasar-extras/animate'
import 'quasar-extras/material-icons'
import Quasar, {
  QBtn,
  QBtnGroup,
  QLayout,
  QLayoutHeader,
  QLayoutDrawer,
  QPage,
  QPageContainer,
  QPageSticky,
  QToolbar,
  QToolbarTitle,
  QList,
  QListHeader,
  QItemSeparator,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QTabs,
  QTab,
  QTabPane,
  BackToTop,
  QField,
  QInput,
  QRadio,
  Notify,
  Dialog
} from 'quasar'

Vue.use(Quasar, {
  i18n: lang,
  components: {
    QBtn,
    QBtnGroup,
    QLayout,
    QLayoutHeader,
    QLayoutDrawer,
    QPage,
    QPageContainer,
    QPageSticky,
    QToolbar,
    QToolbarTitle,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QTabs,
    QTab,
    QTabPane,
    QField,
    QInput,
    QRadio
  },
  directives: {
    BackToTop
  },
  plugins: {
    Notify,
    Dialog
  }
})

import './socketio'
import store from './store'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
