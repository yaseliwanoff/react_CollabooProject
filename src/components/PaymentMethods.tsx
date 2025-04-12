import { useEffect, useState } from "react";
import { apiRoutes } from "@/config/apiConfig";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const PaymentMethods = ({ onPaymentMethodChange }: { onPaymentMethodChange: (method: any) => void }) => {
  const { token } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!token) {
        setError("Token not available");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiRoutes.paymentMethods, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment methods");
        }

        const data = await response.json();
        setPaymentMethods(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [token]);

  if (loading) return <p>Loading payment methods...</p>;
  if (error) return <p>Error: {error}</p>;

  // Фильтруем по категориям
  const worldwideMethods = paymentMethods.filter(method => method.category === "worldwide");
  const cisMethods = paymentMethods.filter(method => method.category === "cis");

  const renderMethodBlock = (method: any) => (
    <div
      key={method.gateway}
      className="items-top space-x-2 border border-[#E4E4E7] hover:border-[#000000] ease-in-out duration-300 rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <input
            type="radio"
            id={method.gateway}
            name="paymentMethod"
            onChange={() => onPaymentMethodChange(method)}
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor={method.gateway} className="text-sm font-medium leading-none">
              {method.image_url ? (
                <img src={method.image_url} alt={method.title} className="w-8 h-8" />
              ) : (
                method.title && <span>{method.title}</span>
              )}
            </label>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
        </div>
        <div>
          <Badge variant={"bold"}>{method.fee_percentage}% fee</Badge>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="font-semibold">Payment Methods (world)</h3>
        <div className="mt-2 flex flex-col gap-3">
          {worldwideMethods.length > 0 ? (
            worldwideMethods.map(renderMethodBlock)
          ) : (
            <p>No payment methods available in this section</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Payment Methods (CIS)</h3>
        <div className="mt-2 flex flex-col gap-3">
          {cisMethods.length > 0 ? (
            cisMethods.map(renderMethodBlock)
          ) : (
            <p>No payment methods available in this section</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
