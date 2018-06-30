<template>
  <div>
    <el-container>
      <el-main>
        <h1>こんぱすさーち</h1>
        <div class="search-form">

          <el-form
            label-width="140px"
            ref="searchForm"
            :model="this.queryParams"
            :rules="this.searchFormRules">

            <el-row :gutter="10">
              <el-col :span="17">
                <el-form-item label="キーワード" prop="keyword">
                  <input-keyword
                    :input-value="this.queryParams.keyword"
                    :handle-action="this.handleKeywordChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label-width="0">
                  <select-search-mode
                    :input-value="this.searchMode"
                    :handle-action="this.handleSearchModeChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item label="都道府県">
                  <select-prefecture
                    :input-value="this.prefecture"
                    :handle-action="this.handlePrefectureChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="開催月">
                  <select-target-month
                    :input-value="this.queryParams.ym"
                    :handle-action="this.handleDatePickerChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item label="検索結果の表示">
                  <select-result-order
                    :input-value="this.queryParams.order"
                    :handle-action="this.handleResultOrderChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="this.handleFormSubmission"
                    class="submit-button"
                    v-loading="this.state.isLoading">
                    検索する
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <ul>
                  <li class="notice">当サイトは<strong><a href="https://connpass.com/" target="_blank">connpass</a></strong>様のAPIを利用したイベント検索サイトです。</li>
                  <li class="notice">注1: 当サイトはイベントの検索を行うことが出来ますが、イベントの参加申し込みを行うことは出来ません。</li>
                  <li class="notice">注2: キーワードは半角/全角スペースで区切ると複数指定する事が出来ます。(2文字以上80文字以内を入力可能)</li>
                  <li class="notice">注3: 仕様上、都道府県を指定するとキーワード検索の条件として追加されます。</li>
                </ul>
              </el-col>
            </el-row>

          </el-form>

        </div>
        <ul>
          <template v-if="this.state.isLoading === false">

            <template v-if="this.state.events.length !== 0">
              <p>{{ this.resultsAvailable }} 件のイベントが見つかりました</p>
              <pagination-module
                :total-items="this.resultsAvailable"
                :current-page="this.queryParams.start"
                :page-size="this.queryParams.count"
                :handle-action="this.handlePageChange"
              />

              <div class="spacer-bottom-24"></div>

              <event-list
                v-for="event in this.state.events"
                :input-event="event"
                :key="event.event_id"
              />

              <p>{{ resultsAvailable }} 件のイベントが見つかりました</p>
              <pagination-module
                :total-items="this.resultsAvailable"
                :current-page="this.queryParams.start"
                :page-size="this.queryParams.count"
                :handle-action="this.handlePageChange"
              />

            </template>

            <li v-else>
              <p>イベントが見つかりませんでした。条件を変更して検索して下さい。</p>
            </li>

            <div class="spacer-bottom-24"></div>
          </template>
          <li v-else>
            <p><i class="el-icon-loading"></i> Loading...</p>
          </li>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import InputKeyword from '@/components/InputKeyword'
import SelectSearchMode from '@/components/SelectSearchMode'
import SelectPrefecture from '@/components/SelectPrefecture'
import SelectTargetMonth from '@/components/SelectTargetMonth'
import SelectResultOrder from '@/components/SelectResultOrder'
import PaginationModule from '@/components/PaginationModule'
import EventList from '@/components/EventList'

export default {
  name: 'SearchPage',
  components: {
    InputKeyword,
    SelectSearchMode,
    SelectPrefecture,
    SelectTargetMonth,
    SelectResultOrder,
    PaginationModule,
    EventList
  },
  data () {
    return {
      searchFormRules: {
        keyword: [
          {
            min: 2,
            max: 80,
            message: 'キーワードは未入力にするか、2〜80文字まで入力することが出来ます',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.search()
  },
  computed: {
    ...mapGetters({
      state: 'event/state',
      queryParams: 'event/queryParams',
      searchMode: 'event/searchMode',
      prefecture: 'event/prefecture',
      resultsReturned: 'event/resultsReturned',
      resultsAvailable: 'event/resultsAvailable'
    })
  },
  watch: {},
  methods: {
    ...mapActions({
      getEvents: 'event/getEvents',
      setQueryParams: 'event/setQueryParams',
      setItems: 'event/setItems',
      setPrefecture: 'event/setPrefecture',
      setSearchMode: 'event/setSearchMode'
    }),

    search () {
      this.getEvents({
        queryParams: this.queryParams,
        searchMode: this.searchMode,
        prefecture: this.prefecture
      })
        .then(response => {
          this.setItems(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    handlePrefectureChange (value) {
      this.setPrefecture({ prefecture: value })
    },

    handleResultOrderChange (value) {
      this.setQueryParams({ order: value })
    },

    handleSearchModeChange (value) {
      this.setSearchMode({ searchMode: value })
    },

    handleKeywordChange (keyword) {
      this.setQueryParams({ keyword: keyword })
    },

    handleDatePickerChange (value) {
      this.setQueryParams({ ym: value })
    },

    handlePageChange (number) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.setQueryParams({ start: number })
          this.search()
        }
      })
    },

    handleFormSubmission () {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.setQueryParams({ start: 1 })
          this.search()
        }
      })
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: normal;
}
p {
  margin: 4px;
}
ul {
  list-style-type: none;
  padding: 0;
}
.search-form {
  color: #2c3e50;
  padding: 20px 12px 8px 12px;
  margin-bottom: 10px;
  display: inline-block;
  width: 800px;
  border-radius: 6px;
  box-shadow: 0px 0px 8px;
  text-align: left;
  text-decoration: none;
}
.submit-button {
  width: 220px;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
li.notice {
  padding: 0px 20px 0px 20px;
  font-size: small;
  color: #2c3e50;
  display: block;
  text-align: left;
}
.spacer-bottom-24 {
  margin-bottom: 24px;
}
.error-msg {
  font-size: small;
  color: red;
  margin: 0px;
  padding: 0px;
}
</style>
