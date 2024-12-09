<template>
  <div>
    <div class="d-flex">
      <yf-tree-select
          v-model="selectValue"
          :tree-attrs="treeParams"
          @getLabelIdsDetail="getLabelIdsDetail"
      />
      <div class="json-display">
        <div>获取label对应键值对 @getLabelIdsDetail</div>
        <div>场景:折叠只返回折叠的 全部返回全部的</div>
        {{value}}
      </div>
    </div>
    <div class="d-flex">
      <yf-tree-select
          v-model="selectValue2"
          :tree-attrs="treeParams"
          @getLabelIdsDetail="getLabelIdsDetail2"
          fold-labels
      />
      <div class="json-display">
        <div>获取label对应键值对 @getLabelIdsDetail</div>
        <div>场景:折叠只返回折叠的 全部返回全部的</div>
        {{value2}}
      </div>
    </div>
  </div>

</template>

<script>
import { data, props } from "../../assets/const";
import ValueArea from "../../components/valueArea.vue";
export default {
  name: "select53",
  components: {
    ValueArea
  },
  data(){
    return {
      selectValue: [],
      selectValue2: [],
      treeParams: {
        data,
        props
      },
      value: '',
      value2: '',
    }
  },
  methods:{
    getLabelIdsDetail(value){
      this.value = JSON.stringify(value, null, 2);
    },
    getLabelIdsDetail2(value){
      this.value2 = JSON.stringify(value, null, 2);
    }
  }
}
</script>

<style scoped>
.json-display {
  white-space: pre-wrap; /* 保留换行和空格 */
  font-family: monospace; /* 使用等宽字体 */
  background-color: #f5f5f5;
  padding: 10px;
  border: 1px solid #ddd;
  flex: 1;
  margin-left: 10px;
}
</style>