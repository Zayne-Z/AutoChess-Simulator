<template>
  <div class="autochess-chesspanel-content">
    <div class="autochess-chesspanel-head-content">
      <div class="autochess-chesspanel-title-content">
        <div>自定义阵容</div>
      </div>
      <div class="autochess-chesspanel-diy-content">
        <div
          class="autochess-chesspanel-chess-content"
          v-for="selectHero in selectHeros"
          :key="selectHero.name"
          @click="selectHeroFn(selectHero)"
        >
          <img :src="selectHero.image" />
        </div>
        <div
          class="autochess-chesspanel-chess-content"
          v-for="(empty, index) in emptyContent"
          :key="index"
        ></div>
      </div>
      <div class="autochess-chesspanel-diy-info">
        <div class="autochess-chesspanel-diy-info-title">Buff效果</div>
        <ul>
          <li v-for="effectDes in showEffectList" :key="effectDes.des">
            <span class="autochess-chesspanel-diy-info-label" :style="{ background: '#' + effectDes.color }">{{effectDes.title}}</span>
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
      races: require('./races.json'),
      heros: require('./heros.json'),
      effect: require('./effect.json'),
      filters: ['全部'],
      showHerosList: [],
      selectHeros: [],
      selectRace: [],
      showEffectList: []
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
      array.length = 10 - this.selectHeros.length
      return array
    }
  },
  created: function () {
    this.showHerosList = JSON.parse(JSON.stringify(this.heros))
  },
  methods: {
    queryHeros (race) {
      race.active = !race.active
      race.showColor = race.active ? race.color : 'fff'
      if (this.filters.indexOf(race.name) > -1) {
        this.filters.splice(this.filters.indexOf(race.name), 1)
        if (race.name === '全部') {
          this._clearRaceSelect()
        } else {
          this._generateShowList()
        }
      } else {
        this.filters.push(race.name)
        if (race.name === '全部') {
          this.showHerosList = JSON.parse(JSON.stringify(this.heros))
        } else {
          this._generateShowList()
        }
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
      if (!isExist && this.selectHeros.length < 10) {
        this.selectHeros.push(hero)
      }
      this._generageShowEffect()
    },
    _generateShowList () {
      this.showHerosList = []
      if (this.filters.indexOf('全部') > -1) {
        this.showHerosList = JSON.parse(JSON.stringify(this.heros))
      } else {
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
      }
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
        let effectDes = this.effect[selectRace.name] ? this.effect[selectRace.name][selectRace.count - 1] : ''
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
    _clearRaceSelect () {
      this.filters = []
      this.showHerosList = []
      this.races.forEach(race => {
        race.active = false
        race.showColor = 'fff'
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
    }
  }
}
</script>

<style scoped>
.autochess-chesspanel-title-content {
  width: 70px;
  margin: 0 10px;
  padding: 2px 10px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
}
.autochess-chesspanel-diy-content {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 10px 20px;
  height: 110px;
}
.autochess-chesspanel-chess-content {
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
  color: #FFF;
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
</style>
