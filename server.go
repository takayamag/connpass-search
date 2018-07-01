package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())

	// CSRF Middleware
	// e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	// 	TokenLookup: "header:X-CSRF-TOKEN",
	// }))

	// CORS restricted
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{echo.GET},
	}))

	// yarn buildで生成された静的ファイルへアクセス出来るようにする
	e.Static("/", "dist")

	// Routes
	// ローカルAPIへのアクセスをconnpass APIへフォワードする
	connpassAPI := e.Group("/api/v1")
	{
		connpassAPI.GET("/event/", ConnpassAPIRequest())
	}

	// 開発時は以下の環境変数の設定が必要
	// GO_RUN_ENV='development'
	// export GO_RUN_ENV
	if os.Getenv("GO_RUN_ENV") == "" {
		// Start server on Production
		e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
	} else {
		// .env.development: For Development
		// .env.test: For Test
		err := godotenv.Load(fmt.Sprintf(".env.%s", os.Getenv("GO_RUN_ENV")))
		if err != nil {
			log.Fatal("Error loading .env file")
		} else {
			// Start server on TEST or Development
			e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
		}
	}
}

// ConnpassAPIRequest handles API call
func ConnpassAPIRequest() echo.HandlerFunc {
	return func(c echo.Context) error {

		baseURL := "https://connpass.com"

		// リクエストURLのPathとクエリ文字列を取得する
		path := c.Request().URL.RequestURI()

		// ベースURLをconnpass APIのドメインへ変更し、URLのPathとクエリ文字列を付け替える
		url := baseURL + path

		resp, err := http.Get(url)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		byteArray, _ := ioutil.ReadAll(resp.Body)

		// connpass APIからのレスポンスを文字列で呼び出し元へ返す
		return c.String(http.StatusOK, string(byteArray))
	}
}
