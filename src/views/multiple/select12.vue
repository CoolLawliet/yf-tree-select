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
  name: "select12",
  components: {
    ValueArea
  },
  data(){
    return {
      selectValue: [
        {id:41,name:'标签四-一'},
        {id:42,name:'标签四-二'},
        {id:421,name:'标签四-二-一'},
        {id:422,name:'标签四-二-二'},
      ],
      treeParams: {
        data,
        filterable: true,
        props
      },
    }
  }
}
</script>

<style scoped>

</style>