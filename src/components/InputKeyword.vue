<template>
  <el-input
    placeholder="関連キーワードを入力"
    v-model.trim="value"
    @change="changeValue"
    class="input-with-option"
    name="keyword">
  </el-input>
</template>

<script>
export default {
  name: 'InputKeyword',
  props: {
    inputValue: {
      type: String,
      required: false
    },
    handleAction: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      value: null
    }
  },
  mounted () {
    this.value = this.inputValue
  },
  methods: {
    changeValue (value) {
      this.handleAction(value)
    }
  }
}
</script>

<style scoped>
.input-with-option {
  width: 100%;
}
.el-input__inner {
  background-color: #fff;
  width: 80%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
