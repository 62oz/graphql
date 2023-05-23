package server

import (
	"log"
	"net/http"
)

func Server() {

	http.HandleFunc("/", Home)
	http.HandleFunc("/login", Login)
	http.HandleFunc("/dashboard", Dashboard)
	http.HandleFunc("*", NotFound)

	http.Handle("/client/", http.StripPrefix("/client/", http.FileServer(http.Dir("client"))))

	log.Println("Starting server port 8080 (http://localhost:8080/)")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}
