import { useEffect, useRef, useState } from "react";
import { useJwt } from "react-jwt";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const { decodedToken } = useJwt(localStorage.getItem('token') as string);

    useEffect(() => {
        if (!decodedToken) return;
        fetchOrders();
    }, [decodedToken]);

    async function fetchOrders() {
        await fetch(`http://localhost:8000/api/orders/${decodedToken.username}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setOrders(data.sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)));
                });
            } else {
                alert('Erreur lors de la récupération des commandes');
            }
        });
    }

    async function payOrder(id: number) {
        await fetch(`http://localhost:8000/api/orders/payment/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            if (response.ok) {
                setOrders([])
                fetchOrders();
                alert('Commande payée');
            } else {
                alert('Erreur lors du paiement de la commande');
            }
        });
    }

    return (
        <div>
            <h1>Orders</h1>
            <div className="listProducts">
                {orders.length > 0 ? orders.map((order: any) => (
                    <div key={order.id} style={{ border: 'solid 1px', padding: '10px', margin: '10px' }}>
                        <h2>{order.id}</h2>
                        <p>{order.total}€</p>
                        <p>{order.status}</p>
                        <p>{'Commandé le ' + new Date(order.createdAt).toLocaleString()}</p>
                        {order.paidAt ? (<p>{'Payé le ' + new Date(order.paidAt).toLocaleString()}</p>
                        ) : <div><p>Non payé</p><button onClick={() => payOrder(order.id)}>Payer la commande</button></div>}
                    </div>
                )) : <p>Aucune commande</p>}
            </div>
        </div>
    )
}
export default Orders;