<template>
  <div class="autochess-battle-content">
    <div class="autochess-chesspanel-head-content">
      <i class="iconfont icon-problem" @click="showDes()" />
      <ChessTabs :tabDatas="tabDatas" @switchModel="switchModel"></ChessTabs>
    </div>
    <ul class="autochess-battle-list-content">
      <li
        v-for="(battle, index) in battles"
        :key="index"
        @click="userBattle(battle)">
        <div v-if="((isSingleModel && battle.type ==='single') || (!isSingleModel && battle.type ==='double')) && battle.model === 'hot'" class="autochess-battle-card-content">
          <div class="autochess-battle-card-colors" :style="{background: battle.colors, height: battle.type ==='double'? '150px': '90px'}"></div>
          <div class="autochess-battle-card">
            <div class="autochess-battle-card-title">{{battle.name}}</div>
            <ul class="autochess-battle-card-heros-content">
              <li v-for="(hero, _index) in battle.group" :key="hero.name + _index">
                <img :src="hero.image" />
              </li>
            </ul>
            <ul class="autochess-battle-card-effect-content">
              <li
                v-for="(effectDes, _index2) in battle.effect"
                :key="effectDes.des + _index2"
                :style="{ background: '#' + effectDes.color }"
              >{{effectDes.title}}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ChessTabs from '../../components/ChessTabs'
import store from '../../store.js'
import { queryObjectByKey, getUUID } from '../../utils/common-utils'
import {
  generateEffectLabelArray,
  generateColorArray
} from '../../utils/chess-utils'
export default {
  components: {
    ChessTabs
  },
  data () {
    return {
      tabDatas: [
        {
          name: '单人模式',
          active: true
        },
        {
          name: '双子模式',
          active: false
        }
      ],
      isSingleModel: true
    }
  },
  computed: {
    races: function () {
      return store.state.races
    },
    heros: function () {
      return store.state.heros
    },
    effect: function () {
      return store.state.effect
    },
    battles: function () {
      let tempBattles = []
      store.state.battles.forEach(battle => {
        let group = []
        battle.group.forEach(heroName => {
          let hero = queryObjectByKey('name', heroName, this.heros)
          group.push(hero)
        })
        const battleObj = battle
        battleObj.id = getUUID()
        battleObj.group = group
        battleObj.effect = generateEffectLabelArray(
          group,
          this.races,
          this.effect
        )
        battleObj.colors = `linear-gradient(${generateColorArray(
          battleObj.effect
        )})`
        tempBattles.push(battleObj)
      })
      return tempBattles
    }
  },
  methods: {
    switchModel (event) {
      this.isSingleModel = event === '单人模式'
    },
    userBattle (battle) {
      wx.showModal({
        title: '是否使用这个阵容',
        success: function (res) {
          if (res.confirm) {
            store.dispatch('setSelectBattle', battle)
            wx.switchTab({
              url: '../index/main'
            })
          }
        }
      })
    },
    showDes () {
      wx.showToast({
        title: `提示：点击喜欢的阵容可以复制到模拟器页面`,
        duration: 3000,
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.autochess-chesspanel-head-content {
  height: 40px;
}
.autochess-battle-list-content {
  width: 100%;
}
.icon-problem {
  float: right;
  font-size: 25px;
  font-weight: 600;
  margin-right: 20px;
}
.autochess-battle-card-content {
  display: flex;
  width: calc(100% - 20px);
  border-radius: 5px;
  margin: 0 10px 10px 10px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.autochess-battle-card-colors {
  width: 10px;
  height: 80px;
  border-radius: 5px 0 0 5px;
  background: linear-gradient(#f44336, #9c27b0);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.autochess-battle-card {
  width: 100%;
}
.autochess-battle-card-title {
  font-size: 14px;
  line-height: 20px;
  margin-left: 10px;
}
.autochess-battle-card-heros-content {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 5px 0 5px 10px;
}
.autochess-battle-card-heros-content img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border-radius: 50%;
}
.autochess-battle-card-effect-content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 5px 0 0 10px;
  width: 100%;
  font-size: 12px;
}
.autochess-battle-card-effect-content li {
  color: #fff;
  background-color: #9c27b0;
  margin: 0 5px 5px 0;
  padding: 2px 5px;
}
</style>
