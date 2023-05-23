export function handleLogin() {
  let jwt = localStorage.getItem('jwt');
  if (jwt) {
    // User is already logged in, redirect to dashboard
    window.location.replace('/dashboard');
  }

  let form = document.getElementById('login-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit();
  }
  );
}

function onSubmit() {
  let usernameOrEmail = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let error = document.getElementById('error');

  let credentials = {
    username: usernameOrEmail,
    password: password
  };

  // Make a POST request to the endpoint
  fetch('https://01.gritlab.ax/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${usernameOrEmail}:${password}`)
    },
    body: JSON.stringify(credentials)
  })
  .then(response => {
    if (response.ok) {
      // Successful login, obtain the JWT from the response
      return response.json();
    } else {
      // Invalid credentials, display an error message
      error.innerHTML = 'Invalid credentials. Please try again.';
      throw new Error('Invalid credentials. Please try again.');
    }
  })
  .then(data => {
    // Store the JWT in the browser's localStorage for future use
    localStorage.setItem('jwt', data);

    // Redirect or perform other actions as needed
    // For example, redirect to the dashboard page:
    window.location.replace('/dashboard');
  })
  .catch(error => {
    // Display the error message to the user
    console.error(error.message);
  });
}

handleLogin()
