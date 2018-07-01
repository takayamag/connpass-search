import moment from 'moment'
moment.locale('ja')

// アクセスした年月をymパラメータの初期値にセットする
let today = moment()
let ym = today.format('YYYYMM')

// connpass API リファレンス イベントサーチAPIを元にパラメータを用意する
// https://connpass.com/about/api/
const itemList = {
  resultsReturned: 0, // 含まれる検索結果の件数
  resultsAvailable: 0, // 検索結果の総件数
  resultsStart: 0, // 検索の開始位置
  events: [], // 検索結果のイベントリスト
  queryParams: {
    count: 10, // 検索結果の最大出力データ件数(仕様: 初期値: 10、最小値：1、最大値：100)
    start: 1, // 何ページ目かを表す値(APIへリクエスト送信時に検索結果の何件目から出力するかを計算する)
    keyword: '', // キーワード検索の入力値 (APIへリクエスト送信時に、AND/OR検索や複数単語指定可能に加工される)
    ym: ym, // 指定した年月に開催されているイベントを検索
    order: 2, // 検索結果の表示順を、更新日時順: 1、開催日時順: 2、新着順: 3で指定
    format: 'json'
  },
  prefecture: '東京都',
  searchMode: 1, // 1: AND検索、2: OR検索
  isLoading: false
}

export default itemList
