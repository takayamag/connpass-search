<template>
  <li class="panel">
    <a :href="event.event_url" target="_blank">
      <p class="trim blue" style="font-weight: bold">
        [{{ calcRemainingDate(event.started_at, event.ended_at) }}] #{{ event.event_id }} - {{ event.title }}
      </p>
      <p>概要: {{ event.catch !== '' ? event.catch : '(概要はありません)' }}</p>
      <p>開催日時：{{ event.started_at | localDateTime }}〜{{ event.ended_at | localDateTime }}</p>
      <p>開催場所: {{ event.address }}</p>
      <p>開催会場: {{ event.place }}</p>
      <p>参加者数/定員数：{{ event.accepted }}／{{ event.limit }} (補欠者数: {{ event.waiting }})</p>
      <p>(最終更新日時: {{ event.updated_at | localDateTime }})</p>
    </a>
    <p v-if="event.series !== null">
      グループタイトル: <a :href="event.series.url" target="_blank">{{ event.series.title }} (#{{ event.series.id }})</a>
    </p>
  </li>
</template>

<script>
import moment from 'moment'
moment.locale('ja')

export default {
  name: 'EvnetList',
  props: {
    inputEvent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      event: null
    }
  },
  created () {
    this.event = this.inputEvent
  },
  mounted () {
  },
  filters: {
    localDateTime (value) {
      return moment(value).format('YYYY/MM/DD HH:mm')
    }
  },
  methods: {
    calcRemainingDate (startDateTime, endDateTime) {
      const DATE_FORMAT = 'YYYY-MM-DD'
      const TODAY = moment(moment().format(DATE_FORMAT)) // 本日の日付を時刻を省いて取得
      const START = moment(startDateTime).format(DATE_FORMAT) // 開催日を時刻を省いて取得
      const END = moment(endDateTime).format(DATE_FORMAT) // 開催終了日を時刻を省いて取得
      const START_OFFSET = TODAY.diff(START, 'days')
      const END_OFFSET = TODAY.diff(END, 'days')

      if (START_OFFSET < -1) {
        // 開始日とアクセス日を比較してマイナスの時は開催前
        // 明日: -1
        // 明後日: -2
        // ...
        return `${START_OFFSET * -1}日後に開催`
      } else if (START_OFFSET === -1) {
        // 明日が開催日
        return '明日開催'
      } else {
        // 開催中と終了の判定
        if (END_OFFSET < 0) {
          // 開催前では無く、終了していなければ開催中
          return '開催中'
        } else if (START_OFFSET === 0 && END_OFFSET === 0) {
          // 開始日と終了日の差分がどちらも0の場合は本日が開催日
          return '本日開催'
        } else {
          // 全ての条件に該当しなければ終了
          return '終了'
        }
      }
    }
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
p {
  margin: 4px;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
li.panel {
  margin: 0 10px;
  color: #2c3e50;
  padding: 20px;
  margin-bottom: 10px;
  display: inline-block;
  width: 800px;
  border-radius: 4px;
  box-shadow: 0px 0px 5px;
  text-align: left;
}
.filter {
  display: flex;
  justify-content: space-between;
  width: 640px;
  margin: 0 auto;
}
.blue {
  color: rgb(20, 40, 131);
}
.trim {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
