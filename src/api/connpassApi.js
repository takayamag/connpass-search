import axios from 'axios'

// APIのENDPOINTをDev環境とProd環境を可変にする
const API_BASE_PATH = process.env.API_ENDPOINT

export default {
  getItems (params, searchMode, prefecture) {
    // connpass API リファレンスによると、複数キーワードは以下のように指定する必要があるため
    // 「name=value1,value2...」の指定が出来るように「params.keyword」を整形する
    // 指定方法: パラメータを複数指定する場合は、 name=value1&name=value2&... または name=value1,value2...
    let temp = []
    // キーワード検索文字列を半角スペース区切りで配列に格納する
    if (params.keyword !== '') {
      /* eslint no-irregular-whitespace: ["error", {"skipRegExps": true}] */
      temp = params.keyword.replace(/　/g, ' ').split(' ')
    }
    // connpass APIには都道府県を受け入れるパラメータが無いため
    // 苦肉の策でキーワード検索のパラメータとして都道府県名を追加する
    if (prefecture !== '') {
      temp.push(prefecture)
    }

    // 半角カンマ区切りのキーワード検索のパラメータを作成する
    let keywords = temp.join(',')

    // 検索結果の何件目から出力するかを指定
    let startItem = params.start
    if (params.start > 1) {
      startItem = (params.start - 1) * params.count + 1
    }

    // axiosのGETリクエストのパラメータをセットする
    let queryString = {
      count: params.count,
      start: startItem,
      ym: params.ym,
      order: params.order,
      format: params.format
    }

    // connpass APIの仕様に合わせてAND検索とOR検索でパラメータ名を変更する
    let defaultSearchKey = 'keyword'
    if (searchMode === 2) { // OR検索
      defaultSearchKey += '_or'
    }
    queryString[defaultSearchKey] = keywords

    return axios.get(`${API_BASE_PATH}/api/v1/event/?`, {
      params: queryString
    })
  }
}
