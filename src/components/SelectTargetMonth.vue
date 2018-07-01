<template>
  <el-date-picker
    v-model="value"
    type="month"
    placeholder="開催月を選択"
    @change='changeValue'
    format="yyyy年MM月"
    value-format="yyyyMM"
  >
  </el-date-picker>
</template>

<script>
export default {
  name: 'SelectTargetMonth',
  props: {
    inputValue: {
      type: String,
      required: false // 開催月未指定の時を考慮する
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
  created () {
    this.value = this.inputValue
  },
  methods: {
    changeValue (value) {
      this.handleAction(value)
    }
  }
}
</script>
