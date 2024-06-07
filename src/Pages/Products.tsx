import { useEffect, useRef, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([])
    const { decodedToken } = useJwt(localStorage.getItem('token') as string);
    useEffect(() => {
        async function fetchProducts() {
            await fetch('http://localhost:8000/api/articles', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            setProducts(data);
                        });
                    } else {
                        alert('Erreur lors de la récupération des produits');
                    }
                });
        }
        fetchProducts();
    }, []);

    async function addProduct(product: { title: string, content: string, price: number }) {
        product.author = localStorage.getItem('token');
        await fetch('http://localhost:8000/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(product)
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setProducts([...products, data]);
                        setProductToAddTitle('');
                        setProductToAddContent('');
                        setProductToAddPrice(0);
                        refTitle.current.value = '';
                        refContent.current.value = '';
                        refPrice.current.value = '';
                        setOpenAddingModal(false);
                    });
                } else {
                    alert('Erreur lors de l\'ajout du produit');
                }
            });
    };

    async function deleteProduct(id: number) {
        await fetch(`http://localhost:8000/api/articles/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
            if (response.ok) {
                setProducts(products.filter((product: any) => product.id !== id));
            } else {
                alert('Erreur lors de la suppression du produit');
            }
        });
    };

    async function addProductToCart(name: string, price: number, id: number) {
        await fetch('http://localhost:8000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ customer: decodedToken.username, items: [{ id: id, product: name, quantity: 1, price: price }] })
        }).then((response) => {
            if (response.ok) {
                alert('Produit ajouté au panier');
                navigate('/cart');
            } else {
                alert('Erreur lors de l\'ajout du produit au panier');
            }
        }
        );
    };

    const [productToAddTitle, setProductToAddTitle] = useState('');
    const [productToAddContent, setProductToAddContent] = useState('');
    const [productToAddPrice, setProductToAddPrice] = useState(0);
    const refTitle = useRef(null);
    const refContent = useRef(null);
    const refPrice = useRef(null);


    const [openAddingModal, setOpenAddingModal] = useState(false);

    return (
        <div>
            <h1>Produits</h1>
            <button onClick={() => setOpenAddingModal(true)}>Ajouter un article</button>
            <div className="listProducts">
                {products && products.map((product: any) => (
                    <div key={product.id} className="product">
                        <img src={`https://picsum.photos/200/200?random=${product.id}`} alt={product.title} />
                        <p>{product.title}</p>
                        <p>{product.content}</p>
                        <p>{product.price}€</p>
                        <button onClick={() => addProductToCart(product.title, product.price, product.id)}>Ajouter au panier</button>
                        <button onClick={() => deleteProduct(product.id)}>Supprimer</button>
                    </div>
                ))}
                {products.length === 0 && <p>Aucun produit</p>}
            </div>
            <div className={!openAddingModal ? "addingModal" : "addingModal show "}>
                <button onClick={() => setOpenAddingModal(false)}>close</button>
                <h2>Ajouter un article</h2>
                <input ref={refTitle} onChange={e => setProductToAddTitle(e.target.value)} type="text" placeholder="Titre" />
                <input ref={refContent} onChange={e => setProductToAddContent(e.target.value)} type="text" placeholder="Contenu" />
                <input ref={refPrice} onChange={e => setProductToAddPrice(Number(e.target.value))} type="number" placeholder="Prix" />
                <button onClick={() => addProduct({ title: productToAddTitle, content: productToAddContent, price: productToAddPrice })}>Ajouter</button>
            </div>
        </div>
    );
};
export default Products;