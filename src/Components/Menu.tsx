import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
    const [isLogged, setIsLogged] = useState(localStorage.getItem('token') !== null);

    useEffect(() => {
        setIsLogged(!!localStorage.getItem('token'));
    }, [isLogged, localStorage.getItem('token')]);

    return (
        <div className="menu">
            <h2>Menu</h2>
            <Link to={"/"}> Acceuil</Link>
            {isLogged ? (<>
                <Link to={"/profile"}> Compte</Link>
                <Link to={"/products"}> Produits</Link>
                <Link to={"/cart"}> Panier</Link>
                <Link to={"/orders"}> Commandes</Link>
            </>
            ) : <Link to={"/log"}> Connexion</Link>}
        </div>
    );
};
export default Menu;