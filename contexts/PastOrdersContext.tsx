import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PastOrder } from "@/models/PastOrder";
import { fetchPastOrders } from "@/service/OrderService";
import { useUser } from "@/contexts/UserContext";

interface PastOrdersContextProps {
  pastOrders: PastOrder[];
  loadPastOrders: (filters?: PastOrderFilters) => void;
  totalPages: number;
}

export interface PastOrderFilters {
  status?: string;       // Filter by order status (e.g., pending, delivered, canceled)
  pageNumber?: number;   // Pagination: page number
  pageSize?: number;     // Pagination: page size
  sortAscending?: boolean; // Sorting: ascending or descending
}

const PastOrdersContext = createContext<PastOrdersContextProps | undefined>(
  undefined
);

export const PastOrdersProvider = ({ children }: { children: ReactNode }) => {
  const { jwt } = useUser(); // Use your user context to get the JWT token
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

    const loadPastOrders = async (filters?: PastOrderFilters) => {
    if (!jwt) return;
  
    const {
      status = 'Pendiente',
      pageNumber = 0,
      pageSize = 10,
      sortAscending = false,
    } = filters || {};
  
    try {
      const response = await fetchPastOrders(status, pageNumber, pageSize, sortAscending);
      if (response && response.payload && response.payload.content) {
        setPastOrders(response.payload.content as PastOrder[]);
        setTotalPages(response.payload.totalPages as number); // Actualizar totalPages
      }
    } catch (error) {
      if (jwt) {
        console.error("Error loading past orders:", error);
      }
    }
  };
  useEffect(() => {
    loadPastOrders();
  }, [jwt]); // Dependency on jwt, so it re-fetches when the user logs in/out

  return (
    <PastOrdersContext.Provider value={{ pastOrders, loadPastOrders, totalPages }}>
      {children}
    </PastOrdersContext.Provider>
  );
};

export const usePastOrders = () => {
  const context = useContext(PastOrdersContext);
  if (!context) {
    throw new Error("usePastOrders must be used within a PastOrdersProvider");
  }
  return context;
};