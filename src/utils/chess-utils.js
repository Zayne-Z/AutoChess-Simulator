function _getColorByRaceName(races, name) {
  let color = '000';
  races.forEach((race) => {
    if (race.name === name) {
      color = race.color;
    }
  });
  return color;
}

export function generateEffectLabelArray(selectHeros, races, effect) {
  // 选中的种族的名字字符串的Array集合，通过直接添加所有选中角色种族来生成
  let selectRaceName = [];
  // 最终选中的种族的SET集合，用来计算一个种族出现多少次
  let selectRaces = [];
  // 最终展示的种族效果集合
  let showEffectList = [];

  selectHeros.forEach((hero) => {
    selectRaceName = selectRaceName.concat(hero.race).concat(hero.vocation);
  });
  selectRaceName.forEach((raceName) => {
    let isExist = false;
    selectRaces.forEach((race) => {
      if (race.name === raceName) {
        race.count++;
        isExist = true;
      }
    });
    if (!isExist) {
      selectRaces.push({ name: raceName, count: 1 });
    }
  });
  selectRaces.forEach((selectRace) => {
    let effectDes = effect[selectRace.name]
      ? effect[selectRace.name][selectRace.count - 1]
      : '';
    if (effectDes) {
      let desObj = {
        title: `${effectDes.substring(1, 2)}${selectRace.name}`,
        des: effectDes,
        color: _getColorByRaceName(races, selectRace.name)
      };
      showEffectList.push(desObj);
    }
  });
  return showEffectList;
}

export function generateColorArray(effect) {
  let colorArray = [];
  effect.forEach((el) => {
    colorArray.push(`#${el.color}`);
  });
  return colorArray;
}

/**
 * 获取当前已选羁绊中英雄数量排名第一的羁绊的名字
 */
export function getTopFetterName(selectedHeros, index) {
  // 1、取得当前羁绊统计对象的集合
  const fetters = [];
  selectedHeros.forEach(hero => {
    const heroFetters = hero.race.concat(hero.vocation);
    heroFetters.forEach(hf => {
      const ft = fetters.find(f => f.name === hf);
      if (ft) {
        ft.count++;
      } else {
        fetters.push({
          name: hf,
          count: 1
        });
      }
    });
  });
  // 2、排序，将数量多的排前
  fetters.sort(function (a, b) {
    return b.count - a.count;
  });
  // 3、取第一个羁绊，从羁绊表中判断该羁绊最高是几个
  return fetters[index].name;
}

export function fillHerosByFetter(effectArray, heroArray, fetterName, selectedHeros, isSingleMode) {
  for (let effect in effectArray) {
    if (fetterName === effect) {
      heroArray.forEach(hero => {
        const isNotFull = (isSingleMode && selectedHeros.length < 10) || (!isSingleMode && selectedHeros.length < 16);
        const isNotExist = !selectedHeros.find(sh => sh.name === hero.name);
        const isFetterMatch = (hero.race.includes(fetterName) || hero.vocation.includes(fetterName));
        isNotFull && isNotExist && isFetterMatch && selectedHeros.push(hero);
      })
    }
  }
}

export default {
  generateEffectLabelArray,
  generateColorArray,
  getTopFetterName,
  fillHerosByFetter
};
