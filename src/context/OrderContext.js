import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderRefresh, setOrderRefresh] = useState(0);

  const refreshOrders = () => {
    setOrderRefresh(prev => prev + 1);
  };

  return (
    <OrderContext.Provider value={{ orderRefresh, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);