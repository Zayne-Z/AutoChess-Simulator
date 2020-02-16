<template>
  <div class="autochess-component-content">
    <div class="autochess-component-model-content">
      <div
        v-for="tabData in _tabDatas"
        :key="tabData.id"
        :class="{active: currentTab.id === tabData.id}"
        @click="switchModel(tabData)"
      >{{tabData.name}}</div>
    </div>
  </div>
</template>

<script>
import { getUUID } from '../utils/cal-utils'
export default {
  name: 'ChessTabs',
  props: ['tabDatas'],
  data () {
    return {
      currentTab: {}
    }
  },
  methods: {
    switchModel (tabData) {
      this.currentTab = tabData
      this.$emit('switchModel', tabData.name)
    }
  },
  computed: {
    _tabDatas: function () {
      let array = []
      this.tabDatas.forEach(element => {
        array.push({
          id: getUUID(),
          name: element
        })
      })
      this.currentTab = array[0]
      return array
    }
  }
}
</script>

<style scoped>
.autochess-component-content {
  width: 100%;
}
.autochess-component-model-content {
  float: left;
  font-size: 12px;
  border: 1px solid #000;
  margin-left: 10px;
}
.autochess-component-model-content div {
  float: left;
  padding: 5px 20px;
}
.autochess-component-model-content div.active {
  background-color: #000;
  color: #fff;
}
</style>
