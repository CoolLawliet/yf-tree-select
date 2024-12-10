<template>
  <div class="d-flex">
    <yf-tree-select
        v-model="selectValue"
        :tree-attrs="treeParams"
        @all-detail="getAllDetail"
    />
    <div class="json-display">
      <div>获取当前id对应的对象所有值 @getAllDetail </div>
      {{value}}
    </div>
  </div>
</template>

<script>
import { data, props } from "../../assets/const";
import ValueArea from "../../components/valueArea.vue";
export default {
  name: "select52",
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
    getAllDetail(value){
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