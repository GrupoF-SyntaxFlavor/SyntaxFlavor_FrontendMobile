import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { PastOrder, OrderItemModel } from '@/models/PastOrder';
import { fetchPastOrders } from '@/service/OrderService';

interface PastOrdersContextProps {
  pastOrders: PastOrder[];
  loadPastOrders: (customerId: number) => void;
}

const PastOrdersContext = createContext<PastOrdersContextProps | undefined>(undefined);

export const PastOrdersProvider = ({ children }: { children: ReactNode }) => {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  const loadPastOrders = async (customerId: number) => {
    const mockId = 2;
    try {
      console.log('Loading past orders for customer:', mockId);
      const response = await fetchPastOrders(mockId);
      console.log('Response received:', response);
      setPastOrders(response.payload as PastOrder[]);
    } catch (error) {
      console.error('Error loading past orders:', error);
    }
  };

    useEffect(() => {
        loadPastOrders(1);
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