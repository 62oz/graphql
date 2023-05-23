package server

import (
	"net/http"
	"text/template"
)

var tpl *template.Template

func init() {
	tpl = template.Must(template.ParseGlob("server/templates/*.html"))
}

func Home(w http.ResponseWriter, r *http.Request) {
	tpl.ExecuteTemplate(w, "index.html", nil)
}

func Login(w http.ResponseWriter, r *http.Request) {
	tpl.ExecuteTemplate(w, "login.html", nil)
}

func Dashboard(w http.ResponseWriter, r *http.Request) {
	tpl.ExecuteTemplate(w, "dashboard.html", nil)
}

func NotFound(w http.ResponseWriter, r *http.Request) {
	tpl.ExecuteTemplate(w, "404.html", nil)
}
