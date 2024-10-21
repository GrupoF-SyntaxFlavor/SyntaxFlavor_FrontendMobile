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
  loadPastOrders: () => void;
}

const PastOrdersContext = createContext<PastOrdersContextProps | undefined>(
  undefined
);

export const PastOrdersProvider = ({ children }: { children: ReactNode }) => {
  const { jwt } = useUser(); // Use your user context to get the JWT token
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  const loadPastOrders = async () => {
    if (!jwt) {
      // User is not logged in, no need to load past orders
      return;
    }

    try {
      const response = await fetchPastOrders();
      if (response && response.payload) {
        setPastOrders(response.payload as PastOrder[]);
      }
    } catch (error) {
      // Show error message only if user is logged in
      if (jwt) {
        console.error("Error loading past orders:", error);

      }
    }
  };

  useEffect(() => {
    loadPastOrders();
  }, [jwt]); // Dependency on jwt, so it re-fetches when the user logs in/out

  return (
    <PastOrdersContext.Provider value={{ pastOrders, loadPastOrders }}>
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
