import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SingIn = () => {
    const navigate = useNavigate();

    function createAccount() {
        fetch('http://localhost:8000/api/users', {
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
                navigate('/log');
            } else {
                alert('Erreur lors de la création du compte');
            }
        });
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h1>Création de compte</h1>
            <p>Adresse E-mail</p>
            <input onChange={e => setUsername(e.target.value)} type="email" />
            <p>Mot de passe</p>
            <input onChange={e => setPassword(e.target.value)} type="password" /><br />
            <button disabled={!username || !password} onClick={() => createAccount()}>Créer le compte</button>
        </div>
    );
};
export default SingIn;