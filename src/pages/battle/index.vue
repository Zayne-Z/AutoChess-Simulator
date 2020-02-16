<template>
  <div class="autochess-battle-content">
    <div class="autochess-chesspanel-head-content">
      <ChessTabs :tabDatas="tabDatas" @switchModel="switchModel"></ChessTabs>
    </div>
    <ul class="autochess-battle-list-content">
      <li class="autochess-battle-card-content"></li>
    </ul>
  </div>
</template>

<script>
import ChessTabs from '../../components/ChessTabs'
export default {
  components: {
    ChessTabs
  },
  data () {
    return {
      tabDatas: ['单人模式', '双子模式']
    }
  },
  methods: {
    switchModel (event) {
      console.log(1, event)
    }
  }
}
</script>

<style>
.autochess-battle-list-content {
  width: 100%;
}
.autochess-battle-card-content {
  width: 100%;
  height: 80px;
  /* border: 1px solid red; */
}
</style>
