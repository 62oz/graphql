import * as h from './helpers.js'
import * as l from './login.js'
import * as d from './dashboard.js'

let routes = [
    {
        path: '/',
        name: 'home'
    },
    {
        path: '/index.html',
        name: 'home'
    },
    {
        path: '/login.html',
        name: 'login'
    },
    {
        path: '/dashboard.html',
        name: 'dashboard'
    }
]

export const router = () => {
    let path = window.location.pathname
    let matchedRoute = routes.find(route => route.path === path)
    let jwt = localStorage.getItem('jwt')

    console.log("path: ", path)

    if (matchedRoute) {
        switch (matchedRoute.name) {
        case 'home':
            if (jwt) {
                h.redirectToDashboard()
            } else {
                h.redirectToLogin()
            }
            break;
        case 'login':
            //l.handleLogin()
            break;
        case 'dashboard':
            //h.handleDashboard()
            break;
        default:
            console.log("No route matched")
            h.pageNotFound()
            break;
        }
    } else {
        console.log("No route matched")
        h.pageNotFound()
    }
}

router()
