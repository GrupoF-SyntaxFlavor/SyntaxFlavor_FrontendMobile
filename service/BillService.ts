import { BACKEND_URL } from "@/constants/.backend-dir";
import { Bill } from "@/models/Bill";

export const createBill = async (bill: Bill) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/bill`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bill),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bill response:", data);
        return data;
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
}
