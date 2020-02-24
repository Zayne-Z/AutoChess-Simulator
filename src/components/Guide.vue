<template>
  <div class="autochess-component-content" @click="next()">
    <i class="iconfont icon-close" @click.stop="close()"/>
    <div
      v-if="currentStep === 1"
      class="autochess-component-guide autochess-component-guide-race"
    >①过滤区：点击标签可以根据激活的标签过滤出想要查找的种族职业相关的棋子。</div>
    <div
      v-if="currentStep === 2"
      class="autochess-component-guide autochess-component-guide-hero"
    >②棋子区：点击棋子将棋子选中到上方的选中区，再次点击可以取消选中。</div>
    <div
      v-if="currentStep === 3"
      class="autochess-component-guide autochess-component-guide-select"
    >③选中区：点击棋子可以取消选中，当存在一个以上的棋子时，可以点击Auto按钮自动补全阵容。</div>
    <div
      v-if="currentStep === 4"
      class="autochess-component-guide autochess-component-guide-effect"
    >④效果区：查看目前阵容组合出来的效果。</div>
    <div
      v-if="currentStep === 5"
      class="autochess-component-guide autochess-component-guide-toolbar"
    >⑤菜单栏：可以切换双子模式。</div>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  data () {
    return {
      currentStep: 1
    }
  },
  methods: {
    close: function () {
      this.$emit('closeGuide')
    },
    next: function () {
      this.currentStep++
      if (this.currentStep > 5) {
        this.close()
      }
    }
  },
  computed: {}
}
</script>
<style scoped>
.autochess-component-content {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 20px;
}
.autochess-component-guide {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 60px;
  border: 3px dashed #fff;
}
.autochess-component-guide-race {
  height: 150px;
  margin-top: 180px;
}
.autochess-component-guide-hero {
  height: 250px;
  margin-top: 300px;
}
.autochess-component-guide-select {
  height: 140px;
  margin-top: 30px;
}
.autochess-component-guide-effect {
  height: 80px;
  margin-top: 160px;
}
.autochess-component-guide-toolbar {
  height: 60px;
  width: 200px;
  padding: 0 20px;
}
.icon-close {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 24px;
  border: 2px solid #fff;
  border-radius: 50%;
}
</style>
