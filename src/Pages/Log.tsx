import { useState } from "react";
import { Link } from "react-router-dom";

const Log = () => {
    function logInAndGetToken() {
        fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    localStorage.setItem('token', data.access_token);
                    window.location.reload();
                });
            } else {
                alert('Erreur lors de la connexion');
            }
        }
        )
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h1>Connexion</h1>
            <p>Adresse E-mail</p>
            <input onChange={e => setUsername(e.target.value)} type="email" />
            <p>Mot de passe</p>
            <input onChange={e => setPassword(e.target.value)} type="password" /><br />
            <button onClick={() => logInAndGetToken()}>Connexion</button>
            <Link to={'/signIn'}>Créer un compte</Link>
        </div>
    );
};
export default Log;