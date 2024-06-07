import { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { decodedToken } = useJwt(localStorage.getItem('token') || '');
    const [profileData, setProfileData] = useState<any>();
    const navigate = useNavigate();
    useEffect(() => {
        if (!decodedToken) return;
        async function fetchProfileData() {
            try {
                fetch('http://localhost:8000/api/users/profile', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: decodedToken.username
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            setProfileData(data);
                        });
                    } else {
                        alert('Erreur lors de la récupération du profil');
                    }
                }
                );
            } catch (error) {
                console.log(error);
            }
        }
        fetchProfileData();
    }, [decodedToken]);
    console.log(profileData);

    return (
        <div>
            <h1>Profile</h1>
            <p>Bonjour, {profileData?.username}</p>
            <button onClick={() => { localStorage.clear(); window.location.reload() }}>Deconnexion</button>
        </div>
    );
}
export default Profile;