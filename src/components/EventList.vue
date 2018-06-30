<template>
  <el-card class="box-card">
    <a :href="event.event_url" target="_blank">
      <div class="clearfix">
        <span class="count-down">{{ calcRemainingDate(event.started_at, event.ended_at) }}</span>
        <span class="date">更新日時: {{ event.updated_at | localDateTime }}</span>
      </div>
      <div class="clearfix">
        <h1 class="trim">#{{ event.event_id }} - {{ event.title }}</h1>
      </div>
      <div style="margin-bottom: 12px;">
        <table summary="イベント詳細">
          <tr>
            <th class="top">概要</th>
            <td class="top">{{ event.catch !== '' ? event.catch : '(概要はありません)' }}</td>
          </tr>
          <tr>
            <th>開催日時</th>
            <td>{{ event.started_at | localDateTime }}〜{{ event.ended_at | localDateTime }}</td>
          </tr>
          <tr>
            <th>開催場所</th>
            <td>{{ event.address }}</td>
          </tr>
          <tr>
            <th>開催会場</th>
            <td>{{ event.place }}</td>
          </tr>
          <tr>
            <th>参加者数/定員数</th>
            <td>{{ event.accepted }}／{{ event.limit !== null ? event.limit : '-' }} (補欠者数: {{ event.waiting }})</td>
          </tr>
        </table>
      </div>
    </a>
    <p v-if="event.series !== null">
      <span class="group">
        <strong>グループ名</strong>: <a :href="event.series.url" target="_blank" class="group-link">{{ event.series.title }} (#{{ event.series.id }})</a>
      </span>
    </p>
  </el-card>
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
h1 {
  font-size: 12pt;
  color: #364e96;
  padding: 0.5em 0;
  border-top: solid 3px #364e96;
  border-bottom: solid 3px #364e96;
}
p {
  margin: 4px;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
table {
	width: 100%;
	border-collapse: collapse;
}
th.top {
  border-top: #b3b3b3 1px solid;
  width: 120px;
}
th {
	border-bottom: #e3e3e3 1px solid;
	border-left: #e3e3e3 1px solid;
	text-align: left;
	background: #f7f7f7;
	padding: 10px;
	font-weight: normal;
  font-size: 14px;
}
td.top {
	border-top: #b3b3b3 1px solid;
}
td {
	border-bottom: #e3e3e3 1px solid;
	border-right: #e3e3e3 1px solid;
	text-align: left;
	padding: 10px;
  font-size: 14px;
}
.trim {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item {
  font-size: 14px;
  margin-bottom: 18px;
}
.group {
  font-size: 11pt;
}
.group-link {
  text-decoration:underline;
}
.date {
  font-size: small;
  float: right;
  padding: 3px 0;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 800px;
  text-align: left;
  padding: 12px;
  margin-bottom: 10px;
  display: inline-block;
  border-radius: 6px;
  box-shadow: 0px 0px 8px;
}
.count-down {
  font-size: 16px;

  color: rgb(255, 123, 0);
}
</style>
