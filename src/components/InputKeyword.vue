<template>
  <el-input
    placeholder="関連キーワードを入力"
    v-model.trim="value"
    @change='changeValue'
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
    action: {
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
      this.action(value)
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

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(10px);
  opacity: 0;
}
</style>
