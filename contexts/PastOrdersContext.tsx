import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { PastOrder, OrderItemModel } from '@/models/PastOrder';
import { fetchPastOrders } from '@/service/OrderService';

interface PastOrdersContextProps {
  pastOrders: PastOrder[];
  loadPastOrders: () => void;
}

const PastOrdersContext = createContext<PastOrdersContextProps | undefined>(undefined);

export const PastOrdersProvider = ({ children }: { children: ReactNode }) => {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  const loadPastOrders = async () => {
    try {
      // console.log('Loading past orders for customer:');
      const response = await fetchPastOrders();
      console.log('Response received:', response);
      setPastOrders(response.payload as PastOrder[]);
    } catch (error) {
      console.error('Error loading past orders:', error);
    }
  };

    useEffect(() => {
        loadPastOrders();
    }, []);

    return (
        <PastOrdersContext.Provider value={{ pastOrders, loadPastOrders }}>
            {children}
        </PastOrdersContext.Provider>
    );
};

export const usePastOrders = () => {
    const context = useContext(PastOrdersContext);
    if (!context) {
        throw new Error('usePastOrders must be used within a PastOrdersProvider');
    }
    return context;
};