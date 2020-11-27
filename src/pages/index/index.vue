<template>
  <div class="autochess-chesspanel-content">
    <Guide v-if="isShowGuide" @closeGuide="closeGuideFn"></Guide>
    <div class="autochess-chesspanel-head-content">
      <div class="autochess-chesspanel-title-content">
        <i class="toolbar-icon iconfont icon-problem" @click="handleGuide()"/>
        <i class="toolbar-icon iconfont icon-restore" @click="handleClear()" />
        <ChessTabs :tabDatas="tabDatas" @switchModel="switchModel"></ChessTabs>
      </div>
      <div class="autochess-chesspanel-diy-content">
        <div
          class="autochess-chesspanel-chess-content"
          :class="{ doubleModel: !isSingleModel}"
          v-for="selectHero in selectHeros"
          :key="selectHero.name"
          @click="handleHeroSelect(selectHero)"
        >
          <img :src="selectHero.image" alt="Hero's photo"/>
        </div>
        <div
          class="autochess-chesspanel-chess-content"
          :class="{ doubleModel: !isSingleModel}"
          v-for="(empty, index) in emptyContent"
          :key="index"
        >
          <i
            class="iconfont icon-autodq"
            v-if="index === 0 && selectHeros.length > 0"
            @click="handleAutoFill()"
          />
        </div>
      </div>
      <div class="autochess-chesspanel-diy-info">
        <ul class="autochess-chesspanel-diy-info-race-statis">
          <li v-for="effectDes in showUnEffectList" :key="effectDes.des">
            <span
              class="autochess-chesspanel-diy-info-label"
              :style="{ background: '#' + effectDes.color, opacity: effectDes.opacity}"
            >{{effectDes.title}}</span>
          </li>
        </ul>
        <div class="autochess-chesspanel-diy-info-title">【Buff效果】</div>
        <ul>
          <li v-for="effectDes in showEffectList" :key="effectDes.des">
            <span
              class="autochess-chesspanel-diy-info-label"
              :style="{ background: '#' + effectDes.color }"
            >{{effectDes.title}}</span>
            <span>{{effectDes.des}}</span>
          </li>
        </ul>
      </div>
    </div>

    <ul class="autochess-chesspanel-race-content">
      <li
        class="autochess-chesspanel-race-card"
        v-for="(race,index) in races"
        :key="index"
        @click="handleHeroQuery(race)"
        :class="{'active': race.active}"
        :style="{ background: '#' + race.showColor }"
      >{{race.name}}</li>
    </ul>

    <div class="autochess-chesspanel-race-info-content">
      <div
        class="autochess-chesspanel-race-info-card-content"
        v-for="(hero, index) in showHerosSet"
        :key="index"
        @click="handleHeroSelect(hero)"
      >
        <img class="autochess-chesspanel-race-info-card" :src="hero.image" alt="hero's photo"/>
        <div class="autochess-chesspanel-race-info-card-name">{{hero.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ChessTabs from '_c/ChessTabs'
import Guide from '_c/Guide'
import store from '@/store'
import ChessUtils from '@/utils/chess-utils'
export default {
  components: {
    ChessTabs,
    Guide
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
      filters: ['全部'],
      showHerosList: [],
      selectRace: [],
      showEffectList: [],
      selectHeros: [],
      isSingleModel: true,
      isInit: false,
      showUnEffectList: [],
      isShowGuide: false
    }
  },
  computed: {
    races: function () {
      return store.state.races
    },
    heros: function () {
      if (!this.isInit && store.state.heros.length > 0) {
        this.isInit = true
        this.showHerosList = JSON.parse(JSON.stringify(store.state.heros))
      }
      return store.state.heros
    },
    effect: function () {
      return store.state.effect
    },
    showHerosSet: function () {
      let nameArray = []
      let tempArray = []
      this.showHerosList.forEach(hero => {
        if (nameArray.indexOf(hero.name) === -1) {
          tempArray.push(hero)
          nameArray.push(hero.name)
        }
      })
      return tempArray
    },
    emptyContent: function () {
      let array = [{}]
      array.length = this.totalContent - this.selectHeros.length
      return array
    },
    totalContent: function () {
      return this.isSingleModel ? 10 : 16
    },
    selectHerosWatch: function () {
      if (store.state.selectBattle.group) {
        if (store.state.selectBattle.type === 'double') {
          this.tabDatas = [{name: '单人模式', active: false}, {name: '双子模式', active: true}]
          this.isSingleModel = false
        } else {
          this.tabDatas = [{name: '单人模式', active: true}, {name: '双子模式', active: false}]
          this.isSingleModel = true
        }
        this.selectHeros = JSON.parse(
          JSON.stringify(store.state.selectBattle.group)
        )
        this.showEffectList = JSON.parse(
          JSON.stringify(store.state.selectBattle.effect)
        )
        store.dispatch('clearSelectBattle')
      }
      return []
    }
  },
  created () {
    const db = wx.cloud.database({ env: 'zayne-autochess-nj0726' })
    const _this = this
    db.collection('AutoChessDB').get({
      success (res) {
        res.data.forEach(resData => {
          switch (resData._id) {
            case 'races_cloud':
              _this.races = resData.result
              break
            case 'effect_cloud':
              _this.effect = resData.result
              break
            case 'heros_cloud':
              _this.heros = resData.result
              break
            default:
              _this.battles = resData.result
              break
          }
        })
      }
    })
  },
  methods: {
    handleClear () {
      this.selectHeros = []
      this.showEffectList = []
      this.showUnEffectList = []
    },
    handleGuide () {
      this.isShowGuide = true
    },
    switchModel (tabName) {
      this.activeData = ''
      this.isSingleModel = tabName === '单人模式'
      if (this.isSingleModel && this.selectHeros.length > 10) {
        this.selectHeros.length = 10
      }
    },
    handleHeroQuery (race) {
      // 1、设置是否激活
      race.active = !race.active
      // 2、设置背景色
      race.showColor = race.active ? race.color : 'fff'
      // 3、判断是否全选按钮
      if (race.name === '全部') {
        // 4、全选按钮逻辑
        this._selectAllSwitch()
      } else {
        // 5、其他按钮逻辑
        this._selectSwitch(race)
      }
    },
    handleHeroSelect (hero) {
      let isExist = false
      for (let i = 0, len = this.selectHeros.length; i < len; i++) {
        if (this.selectHeros[i].name === hero.name) {
          this.selectHeros.splice(i, 1)
          isExist = true
          break
        }
      }
      if (!isExist && this.selectHeros.length < this.totalContent) {
        this.selectHeros.push(hero)
      }
      this.$_generageShowEffect()
    },
    _selectAllSwitch () {
      let isSelectAll = this.filters.indexOf('全部')
      this._clearRaceSelect(isSelectAll)
      if (isSelectAll) {
        this.showHerosList = JSON.parse(JSON.stringify(this.heros))
      } else {
        this.showHerosList = []
      }
    },
    _clearRaceSelect (isSelectAll) {
      this.filters = isSelectAll ? ['全部'] : []
      this.showHerosList = []
      this.races.forEach((race, index) => {
        if (index !== 0) {
          race.active = false
          race.showColor = 'fff'
        }
      })
    },
    _selectSwitch (race) {
      // 已经存在的，反选
      if (this.filters.indexOf(race.name) > -1) {
        this.filters.splice(this.filters.indexOf(race.name), 1)
        this._generateShowList()
      } else {
        if (this.filters.indexOf('全部') > -1) {
          this.filters.splice(this.filters.indexOf('全部'), 1)
          // 重置全选按钮的颜色
          this.races[0].active = false
          this.races[0].showColor = 'fff'
        }
        this.filters.push(race.name)
        this._generateShowList()
      }
    },
    _generateShowList () {
      this.showHerosList = []
      this.filters.forEach(filter => {
        this.heros.forEach(hero => {
          if (
            hero.race.indexOf(filter) > -1 ||
            hero.vocation.indexOf(filter) > -1
          ) {
            this.showHerosList.push(hero)
          }
        })
      })
    },
    $_generageShowEffect () {
      // 1、获取选中的种族的名字字符串的Array集合，通过直接添加所有选中角色种族来生成，存在重复
      let selectRaceName = []
      this.selectHeros.forEach(hero => {
        selectRaceName = selectRaceName.concat(hero.race).concat(hero.vocation)
      })
      // 2、获取最终选中的种族的SET集合，用来去重计算一个种族出现多少次
      let selectRaces = []
      selectRaceName.forEach(raceName => {
        let isExist = false
        selectRaces.forEach(race => {
          if (race.name === raceName) {
            race.count++
            isExist = true
          }
        })
        if (!isExist) {
          selectRaces.push({ name: raceName, count: 1 })
        }
      })

      // 3、最终展示的种族效果集合，以及全部的种族统计标签
      this.showEffectList = []
      this.showUnEffectList = []
      selectRaces.forEach(selectRace => {
        // 3.1、获取种族效果的描述和种族颜色
        let effectDes = this.effect[selectRace.name]
          ? this.effect[selectRace.name][selectRace.count - 1]
          : ''
        let color = this._getColorByRaceName(selectRace.name)
        // 3.2、如果获取不到描述，说明未触发效果
        if (effectDes) {
          let desObj = {
            title: `${effectDes.substring(1, 2)}${selectRace.name}`,
            des: effectDes,
            color: color
          }
          this.showEffectList.push(desObj)
        }
        // 4、计算未触发的效果
        const unEffectDes = this._generageRaceStatis(this.effect, selectRace.name, selectRace.count)
        if (unEffectDes) {
          let effectObj = {
            title: unEffectDes,
            opacity: color === 'FFEB3B' ? 0.7 : color === 'CDDC39' ? 0.5 : 0.3,
            color: color
          }
          this.showUnEffectList.push(effectObj)
        }
      })
    },
    _generageRaceStatis (effect, raceName, raceCount) {
      let effectDesList = effect[raceName]
      let effectCount = effectDesList[raceCount - 1].substring(1, 2)
      let result = ''
      if (!effectCount) {
        // 如果没有匹配到描述，说明还未触发最低的效果，将下标改为raceCount，也就是+1开始遍历,直到找到最低的触发个数
        for (let i = raceCount, len = effectDesList.length; i < len; i++) {
          effectCount = effectDesList[i].substring(1, 2)
          if (effectCount) {
            result = `${raceCount}/${effectCount}${raceName}`
            break
          }
        }
      } else if (raceCount > effectCount) {
        // 如果没有匹配到描述，说明还未触发最低的效果，将下标改为raceCount，也就是+1开始遍历,直到找到最低的触发个数
        for (let i = raceCount, len = effectDesList.length; i < len; i++) {
          effectCount = effectDesList[i].substring(1, 2)
          if (effectCount && effectCount > raceCount) {
            result = `${raceCount}/${effectCount}${raceName}`
            break
          }
        }
      }
      return result
    },
    _getColorByRaceName (name) {
      let color = '000'
      this.races.forEach(race => {
        if (race.name === name) {
          color = race.color
        }
      })
      return color
    },
    handleAutoFill () {
      // 根据火热阵容列表，遍历判断目前已选中的棋子是否匹配
      let isMatch = true
      let autoGroup = []
      for (let i = 0, len = this.battles.length; i < len; i++) {
        isMatch = true
        this.selectHeros.forEach(hero => {
          if (this.battles[i].group.indexOf(hero.name) === -1) {
            isMatch = false
          }
        })
        isMatch = isMatch && ((this.isSingleModel && this.battles[i].type === 'single') || (!this.isSingleModel && this.battles[i].type === 'double'))
        // 如果isMatch没有被改变，说明已经匹配到了，可以停止寻找
        if (isMatch) {
          autoGroup = this.battles[i].group
          break
        }
      }
      // 查询结束后如果匹配就自动填充阵容，如果不匹配则自动根据现有棋子自动凑齐
      if (isMatch) {
        this.$_autoFill(autoGroup)
      } else {
        // 2020-11-27 更新了第一版算法
        this.$_aiFill()
        // wx.showToast({
        //   title: '抱歉，暂时没有找到匹配的推荐阵容!',
        //   icon: 'none'
        // })
      }
    },
    $_aiFill () {
      let index = 0;
      while ((this.selectHeros.length < 10 && this.isSingleModel) || (!this.isSingleModel && this.selectHeros.length < 16)) {
        const fetterName = ChessUtils.getTopFetterName(this.selectHeros, index);
        ChessUtils.fillHerosByFetter(this.effect, this.heros, fetterName, this.selectHeros, this.isSingleModel);
        index++;
      }
      this.$_generageShowEffect();
    },
    $_autoFill (autoGroup) {
      this.heros.forEach(hero => {
        if (
          autoGroup.indexOf(hero.name) > -1 &&
          !this.isIncludes(hero, this.selectHeros, 'name')
        ) {
          this.selectHeros.push(hero)
        }
      })
      this.$_generageShowEffect()
    },
    isIncludes (obj, array, key) {
      let flag = false
      for (let i = 0, len = array.length; i < len; i++) {
        if (obj[key] === array[i][key]) {
          flag = true
          break
        }
      }
      return flag
    },
    closeGuideFn () {
      this.isShowGuide = false
    }
  }
}
</script>

<style scoped>
.autochess-chesspanel-title-content {
  width: 100%;
}
.autochess-chesspanel-model-content {
  float: left;
  font-size: 12px;
  border: 1px solid #000;
  margin-left: 10px;
}
.autochess-chesspanel-model-content div {
  float: left;
  padding: 5px 20px;
}
.autochess-chesspanel-model-content div.active {
  background-color: #000;
  color: #fff;
}
.autochess-chesspanel-diy-content {
  display: flex;
  width: calc(100% - 40px);
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 20px 0 20px;
  min-height: 110px;
}
.autochess-chesspanel-chess-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px #999 dashed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 2% 10px 2%;
}
.autochess-chesspanel-chess-content img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.autochess-chesspanel-chess-content.doubleModel,
.autochess-chesspanel-chess-content.doubleModel img {
  width: 30px;
  height: 30px;
}
.autochess-chesspanel-chess-content.doubleModel {
  margin: 0 2% 0 1%;
}
.autochess-chesspanel-diy-info {
  font-size: 12px;
  padding: 0 10px;
}
.autochess-chesspanel-diy-info li {
  margin: 2px 0;
}

.autochess-chesspanel-diy-info-race-statis {
  display: flex;
  flex-wrap: wrap;
}
.autochess-chesspanel-diy-info-title {
  font-weight: 700;
  margin: 5px 0 0 -8px;
}
.autochess-chesspanel-diy-info-label {
  color: #fff;
  padding: 0 2px;
  margin-right: 5px;
}
.autochess-chesspanel-race-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 80px;
  margin-top: 10px;
}
.autochess-chesspanel-race-card {
  border: 1px solid #666;
  width: 40px;
  height: 20px;
  margin: 0 2px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.autochess-chesspanel-race-card.active {
  color: white;
  background: #000;
}
.autochess-chesspanel-race-info-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 10px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
.autochess-chesspanel-race-info-card-content {
  margin: 1%;
  border: 1px solid #000;
  background-color: #000;
}
.autochess-chesspanel-race-info-card {
  width: 60px;
  height: 60px;
}
.autochess-chesspanel-race-info-card-name {
  color: #fff;
  font-size: 12px;
  text-align: center;
}
.toolbar-icon {
  float: right;
  font-size: 25px;
  font-weight: 600;
}
.icon-problem {
  margin-right: 20px;
}
.icon-autodq {
  font-size: 30px;
  border-radius: 50%;
  animation: rotate 5s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
    box-shadow: 0px 0px 10px #fff;
  }
  50% {
    transform: rotate(180deg);
    box-shadow: 0px 0px 45px #fff;
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0px 0px 10px #fff;
  }
}
</style>
