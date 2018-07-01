<template>
  <el-select
    v-model="value"
    value-key="value"
    placeholder="AND/OR"
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
  name: 'SelectSearchMode',
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
          label: 'AND検索',
          value: 1
        },
        {
          label: 'OR検索',
          value: 2
        }
      ]
    }
  },
  created () {
    // 現在選択中の検索モード(AND or OR検索)をセットする
    let mode = this.inputValue
    let selectedItem = this.items.filter(function (item) {
      if (item.value === mode) {
        return item
      }
    })
    this.value = selectedItem[0]
  },
  methods: {
    changeValue (value) {
      // AND検索の 1 を渡すとキーワード検索のパラメータとして keyword が使われる
      // OR検索の 2 を渡すとキーワード検索のパラメータとして keyword_or が使われる
      // connpassApi.js 内の getItems メソッドで分岐する
      this.handleAction(value.value)
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 124px;
  }
</style>
