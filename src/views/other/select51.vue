<template>
  <div class="d-flex">
    <yf-tree-select
        v-model="selectValue"
        :tree-attrs="treeParams"
        @value-detail="getValueDetail"
    />
    <div class="json-display">
      <div>需要v-model基本类型数组，但是还需要label使用@getValueDetail</div>
      {{value}}
    </div>
  </div>
</template>

<script>
import { data, props } from "../../assets/const";
import ValueArea from "../../components/valueArea.vue";
export default {
  name: "select51",
  components: {
    ValueArea
  },
  data(){
    return {
      selectValue: [],
      treeParams: {
        data,
        props
      },
      value: ''
    }
  },
  methods:{
    getValueDetail(value){
      this.value = JSON.stringify(value, null, 2);
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