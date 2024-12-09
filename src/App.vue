<template>
  <div id="app">
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane name="single" label="单选">
        <el-tabs tab-position="left">
          <el-tab-pane label="只能选子节点">
            <select1/>
          </el-tab-pane>
          <el-tab-pane label="选任意节点">
            <select3/>
          </el-tab-pane>
          <el-tab-pane label="选择节点值为键值对">
            <select5/>
          </el-tab-pane>
          <el-tab-pane label="简单值回显">
            <select7/>
          </el-tab-pane>
          <el-tab-pane label="复杂值回显">
            <select9/>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane name="multiple" label="多选">
        <el-tabs tab-position="left">
          <el-tab-pane label="单值数组">
            <select2/>
          </el-tab-pane>
          <el-tab-pane label="对象数组">
            <select4/>
          </el-tab-pane>
          <el-tab-pane label="折叠labels，只展示父级">
            <select6/>
          </el-tab-pane>
          <el-tab-pane label="只能选子节点">
            <select8/>
          </el-tab-pane>
          <el-tab-pane label="回显单值数组">
            <select10/>
          </el-tab-pane>
          <el-tab-pane label="回显对象数组">
            <select12/>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane name="other" label="其他">
        <el-tabs tab-position="left">
          <el-tab-pane label="获取选中的键值对">
            <select51/>
          </el-tab-pane>
          <el-tab-pane label="获取选中对应对象">
            <select52/>
          </el-tab-pane>
          <el-tab-pane label="获取label对应对象">
            <select53/>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Select1 from "./views/single/select1.vue";
import Select3 from "./views/single/select3.vue";
import Select5 from "./views/single/select5.vue";
import Select7 from "./views/single/select7.vue";
import Select9 from "./views/single/select9.vue";
import Select2 from "./views/multiple/select2.vue";
import Select4 from "./views/multiple/select4.vue";
import Select6 from "./views/multiple/select6.vue";
import Select8 from "./views/multiple/select8.vue";
import Select10 from "./views/multiple/select10.vue";
import Select12 from "./views/multiple/select12.vue";
import Select51 from "./views/other/select51.vue";
import Select52 from "./views/other/select52.vue";
import Select53 from "./views/other/select53.vue";
export default {
  name: 'App',
  components: {
    Select53,
    Select52,
    Select51,
    Select12,
    Select10,
    Select8,
    Select6,
    Select4,
    Select2,
    Select9,
    Select7,
    Select5,
    Select1,
    Select3
  },
  data() {
    return {
      active: 'single'
    }
  }
}
</script>

<style>
#app {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.d-flex {
  display: flex;
}
</style>
