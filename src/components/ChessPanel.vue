<template>
  <div class="autochess-chesspanel-content">
    <div class="autochess-chesspanel-head-content">
      <div class="autochess-chesspanel-title-content">
        <i class="iconfont icon-restore" @click="clearAll()" />
        <div class="autochess-chesspanel-model-content">
          <div :class="{active: isSingleModel}" @click="switchModel(true)">单人模式</div>
          <div :class="{active: !isSingleModel}" @click="switchModel(false)">双子模式</div>
        </div>
      </div>
      <div class="autochess-chesspanel-diy-content">
        <div
          class="autochess-chesspanel-chess-content"
          :class="{ doubleModel: !isSingleModel}"
          v-for="selectHero in selectHeros"
          :key="selectHero.name"
          @click="selectHeroFn(selectHero)"
        >
          <img :src="selectHero.image" />
        </div>
        <div
          class="autochess-chesspanel-chess-content"
          :class="{ doubleModel: !isSingleModel}"
          v-for="(empty, index) in emptyContent"
          :key="index"
        >
          <i
            class="iconfont icon-autodq"
            v-if="index === 0 && selectHeros.length > 0 && isSingleModel"
            @click="autoFill()"
          />
        </div>
      </div>
      <div class="autochess-chesspanel-diy-info">
        <div class="autochess-chesspanel-diy-info-title">Buff效果</div>
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
        @click="queryHeros(race)"
        :class="{'active': race.active}"
        :style="{ background: '#' + race.showColor }"
      >{{race.name}}</li>
    </ul>

    <div class="autochess-chesspanel-race-info-content">
      <div
        class="autochess-chesspanel-race-info-card-content"
        v-for="(hero, index) in showHerosSet"
        :key="index"
        @click="selectHeroFn(hero)"
      >
        <img class="autochess-chesspanel-race-info-card" :src="hero.image" />
        <div class="autochess-chesspanel-race-info-card-name">{{hero.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChessPanel',
  data () {
    return {
      races: require('./races2.json'),
      heros: require('./heros2.json'),
      effect: require('./effect2.json'),
      battles: require('./battle.json'),
      filters: ['全部'],
      showHerosList: [],
      selectHeros: [],
      selectRace: [],
      showEffectList: [],
      isSingleModel: true
    }
  },
  computed: {
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
    }
  },
  created: function () {
    this.showHerosList = JSON.parse(JSON.stringify(this.heros))
  },
  methods: {
    clearAll () {
      this.selectHeros = []
      this.showEffectList = []
    },
    switchModel (flag) {
      if (flag && this.selectHeros.length > 10) {
        this.selectHeros.length = 10
      }
      this.isSingleModel = flag
    },
    queryHeros (race) {
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
    selectHeroFn (hero) {
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
      this._generageShowEffect()
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
    _generageShowEffect () {
      // 选中的种族的名字字符串的Array集合，通过直接添加所有选中角色种族来生成
      let selectRaceName = []
      // 最终选中的种族的SET集合，用来计算一个种族出现多少次
      let selectRaces = []
      // 最终展示的种族效果集合
      this.showEffectList = []

      this.selectHeros.forEach(hero => {
        selectRaceName = selectRaceName.concat(hero.race).concat(hero.vocation)
      })
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
      selectRaces.forEach(selectRace => {
        let effectDes = this.effect[selectRace.name]
          ? this.effect[selectRace.name][selectRace.count - 1]
          : ''
        if (effectDes) {
          let desObj = {
            title: `${effectDes.substring(1, 2)}${selectRace.name}`,
            des: effectDes,
            color: this._getColorByRaceName(selectRace.name)
          }
          this.showEffectList.push(desObj)
        }
      })
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
    autoFill () {
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
        // 如果isMatch没有被改变，说明已经匹配到了，可以停止寻找
        if (isMatch) {
          autoGroup = this.battles[i].group
          break
        }
      }
      debugger
      // 查询结束后如果匹配就自动填充阵容，如果不匹配弹出暂时没有合适的热门阵容
      if (isMatch) {
        this._autoFill(autoGroup)
      } else {
        wx.showToast({title: '抱歉，暂时没有找到匹配的推荐阵容!', icon: 'none'})
      }
    },
    _autoFill (autoGroup) {
      this.heros.forEach(hero => {
        if (autoGroup.indexOf(hero.name) > -1 && !this.isIncludes(hero, this.selectHeros, 'name')) {
          this.selectHeros.push(hero)
        }
      })
      this._generageShowEffect()
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
    }
  }
}
</script>

<style scoped>
@import "../../static/iconfont/iconfont.css";
.autochess-chesspanel-title-content {
  width: 100%;
}
.autochess-chesspanel-title {
  width: 70px;
  margin: 0 10px;
  padding: 2px 10px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  display: inline-block;
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
  padding: 10px 20px;
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
.autochess-chesspanel-diy-info-title {
  font-weight: 600;
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
.icon-restore {
  float: right;
  font-size: 25px;
  font-weight: 600;
  margin-right: 20px;
}
.icon-autodq {
  font-size: 30px;
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
