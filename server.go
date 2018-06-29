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

	e.Static("/", "dist")

	// Routes
	connpassAPI := e.Group("/api/v1")
	{
		connpassAPI.GET("/event/", ConnpassAPIRequest())
	}

	if os.Getenv("GO_RUN_ENV") == "" {
		// Start server on Production
		e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
	} else {
		err := godotenv.Load(fmt.Sprintf(".env.%s", os.Getenv("GO_RUN_ENV")))
		if err != nil {
			log.Fatal("Error loading .env file")
		} else {
			// Start server
			e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
		}
	}
}

func ConnpassAPIRequest() echo.HandlerFunc {
	return func(c echo.Context) error {

		baseURL := "https://connpass.com"
		path := c.Request().URL.RequestURI()
		url := baseURL + path

		resp, err := http.Get(url)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		byteArray, _ := ioutil.ReadAll(resp.Body)

		return c.String(http.StatusOK, string(byteArray))
	}
}
