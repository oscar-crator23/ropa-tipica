function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username.trim() === "" || password.trim() === "") {
        alert("Por favor, ingrese usuario y contraseña.");
        return;
    }

    // Simulación de autenticación exitosa
    if (username === "oscar" && password === "1234") {
        window.location.href = "success.html"; // Redirige a la página de éxito
    } else {
        alert("Credenciales incorrectas. Inténtelo de nuevo.");
    }
}

