import { redirectToLogin } from './helpers.js'

export function handleDashboard() {
    let logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('jwt')
        redirectToLogin()
    })
    let jwt = localStorage.getItem('jwt')

    if (jwt) {
        // GraphQL query to fetch the user's data
        let query = `
        query {
            user {
                id
                login
                firstName
                lastName
                email
                auditRatio
                totalDown
                totalUp
            }
            transaction(where: { _or: [{ type: { _eq: "xp" }, eventId: { _eq: 20} }, { type: { _ilike: "skill%" } }] }) {
                createdAt
                type
                amount
                path
                attrs
            }
        }`;

        // Make a POST request to the endpoint, include jwt in the Authorization header
        fetch('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => {
            if (response.ok) {
                // Successful request, parse the JSON response
                return response.json()
            }
        })
        .then(data => {
            // Display the user's data
            let user = data.data.user[0]
            let transactions = data.data.transaction
            let xp = transactions.filter(transaction => transaction.type === 'xp')
            // sort by date
            transactions.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            })

            console.log(user)
            console.log("xp::::::", xp)
            let xp_sum = xp.reduce((acc, curr) => {
                return acc + curr.amount
            }, 0)
            console.log(xp_sum)
            let skills_xp = transactions.filter(transaction => transaction.type !== 'xp')
            //map by skill and sum xp
            let skills = skills_xp.reduce((acc, curr) => {
                let skill = curr.type.split('_')[1]
                if (acc[skill]) {
                    acc[skill] += curr.amount
                } else {
                    acc[skill] = curr.amount
                }
                return acc
            }, {})
            console.log(skills)
            // get the ones called css, docker, go, html, js, sql and separate them and their values
            let skills_lang = Object.keys(skills).reduce((acc, curr) => {
                if (curr === 'css' || curr === 'docker' || curr === 'go' || curr === 'html' || curr === 'js' || curr === 'sql') {
                    acc[curr] = skills[curr]
                }
                return acc
            }, {})
            console.log("langues: ", skills_lang)
            let skills_type = Object.keys(skills).reduce((acc, curr) => {
                if (curr != 'css' && curr != 'docker' && curr != 'go' && curr != 'html' && curr != 'js' && curr != 'sql') {
                    acc[curr] = skills[curr]
                }
                return acc
            }, {})
            console.log("types: ", skills_type)

            let display_xp = 0
            if (xp_sum > 1000000) {
                display_xp = Math.floor((xp_sum/1000000)) + " Mb"
            } else if (xp_sum > 1000) {
                display_xp = Math.floor((xp_sum/1000)) + " kB"
            } else {
                display_xp = xp_sum + " B"
            }

            let userElement = document.getElementById('user')
            userElement.innerHTML = `
                <p>Username: ${user.login}</p>
                <p>Email: ${user.email}</p>
                <p>XP: ${display_xp}</p>
                <p>Audit Ratio: ${(user.totalUp/user.totalDown).toFixed(1)}</p>
            `

            drawCharts(skills_lang, skills_type, xp)

        })
        .catch(error => {
            // Display the error message to the user
            console.error(error.message)
        })
    } else {
        redirectToLogin()
    }
}

handleDashboard()

function drawCharts(skills_lang, skills_type, xp) {
    // xp chart
    // Get createdAt in an array
    xp.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt)
    })
    let xp_labels = xp.map(transaction => {
        let formattedDate = new Date(transaction.createdAt)
        return formattedDate.toLocaleDateString()
    })
    // Get amount in an array
    let xp_values = xp.map(transaction => {
        return (transaction.amount/1000).toFixed(1)
    })
    const chart_xp = document.getElementById('chart_xp');
    const ctx = chart_xp.getContext('2d');
    const chartData = {
        labels: xp_labels,
        datasets: [{
          label: 'XP progression',
          data: xp_values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      // Options for the line chart
      const chartOptions = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      // Create the line chart
      const lineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
        });

    // skills chart
    // Get labels and values in an array
    let chart_skills = document.getElementById('chart_skills');
    let ctx2 = chart_skills.getContext('2d');
    let skills_lang_labels = Object.keys(skills_lang)
    let skills_lang_values = Object.values(skills_lang)
    const chartData2 = {
        labels: skills_lang_labels,
        datasets: [{
          label: 'Pie Chart',
          data: skills_lang_values,
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(0, 0, 0)', 'rgb(255, 0, 0)', 'rgb(0, 255, 0)'],
        }]
      };

      // Options for the pie chart
      const chartOptions2 = {
        responsive: true,
      };

      // Create the pie chart
      const pieChart = new Chart(ctx2, {
        type: 'pie',
        data: chartData2,
        options: chartOptions2
      });
}
