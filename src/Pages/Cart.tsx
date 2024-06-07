import { useEffect, useRef, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState([] as { id: number, product: string, quantity: number, price: number }[]);
    const [total, setTotal] = useState(0);
    const [order, setOrder] = useState({} as { id: string, shippingAddress: string, shippingMethod: string, invoiceAddress: string });
    const { decodedToken } = useJwt(localStorage.getItem('token') as string);
    const [showShippingMethodInvoiceAddressModal, setShowShippingMethodInvoiceAddressModal] = useState(false);

    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [invoiceAddress, setInvoiceAddress] = useState('');
    const shippingAddressInputRef = useRef(null);
    const shippingMethodInputRef = useRef(null);
    const invoiceAddressInputRef = useRef(null);
    const navigate = useNavigate();

    async function updateShippingMethodInvoiceAddress() {
        await fetch(`http://localhost:8000/api/orders/shipping/${order.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ shippingAddress: shippingAddress, shippingMethod: shippingMethod, invoiceAddress: invoiceAddress })
        }).then((response) => {
            if (response.ok) {
                alert('Adresse de livraison transmise');
                setShowShippingMethodInvoiceAddressModal(false);
                setShippingAddress('');
                setShippingMethod('');
                setInvoiceAddress('');
                shippingAddressInputRef.current.value = '';
                shippingMethodInputRef.current.value = '';
                invoiceAddressInputRef.current.value = '';
                setCart([]);
                navigate('/orders');
            } else {
                alert('Erreur lors de la transmission de l\'adresse de livraison');
            }
        });
    };

    useEffect(() => {
        async function fetchCart() {
            if (!decodedToken) return;
            await fetch(`http://localhost:8000/api/orders/cart/${decodedToken.username}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setCart(data.items);
                        setTotal(data.total.toFixed(2) as unknown as number);
                        setOrder(data);
                    });
                } else {
                    alert('Erreur lors de la récupération des commandes');
                }
            });
        }
        fetchCart();
    }, [decodedToken]);


    return (
        <div>
            <h1>Panier</h1>
            <div className="listProducts">
                {cart.length > 0 ? cart.map((product) => (
                    <div key={product.id} className="product">
                        <h2>Titre : {product.product}</h2>
                        <p>Quantité : {product.quantity}</p>
                        <p>Prix : {product.price}€</p>
                    </div>
                )) : <p>Votre panier est vide</p>}
            </div>
            {cart.length === 0 ? <button onClick={() => { navigate('/products') }}>Ajouter un produit</button> :
                <>
                    <h2>Total {total}€</h2>
                    {order?.shippingAddress ? <p>{order.shippingAddress}</p> : <p>Adresse de livraison non renseignée</p>}
                    {order?.shippingMethod ? <p>{order.shippingMethod}</p> : <p>Méthode de livraison non renseignée</p>}
                    {order?.invoiceAddress ? <p>{order.invoiceAddress}</p> : <p>Adresse de facturation non renseignée</p>}
                    <button onClick={() => { setShowShippingMethodInvoiceAddressModal(true); }}>Renseignez ou modifiez les champs de livraison</button>
                </>
            }

            <div className={!showShippingMethodInvoiceAddressModal ? "shippingAddressModal" : " show"}>
                <button onClick={() => setShowShippingMethodInvoiceAddressModal(false)}> X </button>
                <h2>Adresse de livraison</h2>
                <input ref={shippingAddressInputRef} onChange={e => setShippingAddress(e.target.value)} type="text" placeholder="Adresse de livraison" defaultValue={order?.shippingAddress} />
                <input ref={shippingMethodInputRef} onChange={e => setShippingMethod(e.target.value)} type="text" placeholder="Méthode de livraison" defaultValue={order?.shippingMethod} />
                <input ref={invoiceAddressInputRef} onChange={e => setInvoiceAddress(e.target.value)} type="text" placeholder="Adresse de facturation" defaultValue={order?.invoiceAddress} />
                <button disabled={!shippingAddress || !shippingMethod} onClick={() => updateShippingMethodInvoiceAddress()}>Valider</button>
            </div>
        </div>
    );
};
export default Cart;