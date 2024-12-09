<template>
  <el-form style="flex: 1;" @submit.native.prevent label-width="100px">
    <el-form-item label="v-model:" :error="valueErrorMsg">
      <el-input type="textarea" :rows="8" v-model="modelValue" @input="handleValueChange" />
    </el-form-item>
    <el-form-item label="data:" :error="dataErrorMsg">
      <el-input
        type="textarea"
        v-model="modelData"
        :rows="35"
        @input="handleDataChange"
      />
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "valueArea",
  props: {
    value:{
      type:[String,Number,Array,Object],
      default:''
    },
    data:{
      type:Array,
      default:''
    }
  },
  data() {
    return {
      modelValue: '',
      modelData: '',
      valueErrorMsg: '',
      dataErrorMsg: ''
    }
  },
  watch:{
    value: {
      handler(val) {
        if (['object'].includes(typeof val)) {
          this.modelValue = JSON.stringify(val,null,2)
        } else {
          this.modelValue = val
        }
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.modelData = JSON.stringify(val,null,2)
      },
      immediate: true
    }
  },
  methods: {
    handleValueChange(val) {
      try {
        val = JSON.parse(val)
        this.valueErrorMsg = ''
        this.$emit('update:value',val)
      } catch (error) {
        this.valueErrorMsg = '数据格式有误'
      }
    },
    handleDataChange(val) {
      try {
        val = JSON.parse(val)
        this.dataErrorMsg = ''
        this.$emit('update:data',val)
      } catch (error) {
        this.dataErrorMsg = '数据格式有误'
      }
    }
  }
}
</script>

<style scoped>

</style>