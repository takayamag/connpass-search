<template>
  <div>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="size"
      :total="total"
      :current-page.sync="page"
      @current-change="changeValue"
    />
  </div>
</template>

<script>
export default {
  name: 'PaginationModule',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    clickAction: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      total: null, // 検索結果の最大件数
      page: null, // 現在のページ数
      size: null // ページごとの件数
    }
  },
  created () {
    this.total = this.totalItems
    this.page = this.currentPage
    this.size = this.pageSize
  },
  methods: {
    changeValue (value) {
      return this.clickAction(value)
    }
  }
}
</script>

<style scoped>
</style>
