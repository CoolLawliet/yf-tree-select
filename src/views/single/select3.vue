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
  name: "select3",
  components: {
    ValueArea
  },
  data(){
    return {
      selectValue: '',
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