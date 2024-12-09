<template>
  <div class="d-flex">
    <yf-tree-select
        v-model="selectValue"
        :tree-attrs="treeParams"
    />
    <value-area
        :value.sync="selectValue"
        :data.sync="treeParams.data"
    />
  </div>
</template>

<script>
import { data, props } from "../../assets/const";
import ValueArea from "../../components/valueArea.vue";

export default {
  name: "select9",
  components: {
    ValueArea
  },
  data(){
    return {
      selectValue: {
        id:41,
        name:'标签四-一',
      },
      treeParams: {
        data,
        filterable: true,
        checkStrictly: false,
        props
      },
    }
  }
}
</script>

<style scoped>

</style>