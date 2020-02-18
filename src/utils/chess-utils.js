function _getColorByRaceName (races, name) {
  let color = '000'
  races.forEach(race => {
    if (race.name === name) {
      color = race.color
    }
  })
  return color
}

export function generateEffectLabelArray (selectHeros, races, effect) {
  // 选中的种族的名字字符串的Array集合，通过直接添加所有选中角色种族来生成
  let selectRaceName = []
  // 最终选中的种族的SET集合，用来计算一个种族出现多少次
  let selectRaces = []
  // 最终展示的种族效果集合
  let showEffectList = []

  selectHeros.forEach(hero => {
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
    let effectDes = effect[selectRace.name]
      ? effect[selectRace.name][selectRace.count - 1]
      : ''
    if (effectDes) {
      let desObj = {
        title: `${effectDes.substring(1, 2)}${selectRace.name}`,
        des: effectDes,
        color: _getColorByRaceName(races, selectRace.name)
      }
      showEffectList.push(desObj)
    }
  })
  return showEffectList
}

export function generateColorArray (effect) {
  let colorArray = []
  effect.forEach(el => {
    colorArray.push(`#${el.color}`)
  })
  return colorArray
}

export default {
  generateEffectLabelArray,
  generateColorArray
}
