const OrderIndex = ({orders}) => {
    const
    
    return <ul>
        {orders.map(order => {
            return <li key={order.id}>
                {order.ticket.title} - {order.ticket.status}
            </li>
        })}
    </ul>
}

OrderIndex.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/orders')
    return { orders: data}
} 

export default OrderIndex