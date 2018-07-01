<template>
  <el-select
    v-model="value"
    value-key="value"
    placeholder="表示順を選択"
    size="large"
    @change="changeValue">

    <el-option
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectResultOrder',
  props: {
    inputValue: {
      type: Number,
      required: true
    },
    handleAction: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      value: null,
      items: [
        {
          label: '開催日時順',
          value: 2
        },
        {
          label: '新着順',
          value: 3
        },
        {
          label: '更新日時順',
          value: 1
        }
      ]
    }
  },
  created () {
    // 現在選択中の検索結果の表示順をセットする
    let order = this.inputValue
    let selectedValue = this.items.filter(function (item) {
      if (item.value === order) {
        return item
      }
    })
    this.value = selectedValue[0]
  },
  methods: {
    changeValue (value) {
      // 検索条件指定のために order パラメータへ数値を渡す
      this.handleAction(value.value)
    }
  }
}
</script>

<style scoped>
</style>
