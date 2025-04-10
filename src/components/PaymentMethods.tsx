import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"; // Предположим, что Badge — это компонент, который у вас используется для отображения
import { useAuth } from "@/hooks/useAuth"; // Ваш хук аутентификации

const PaymentMethods = () => {
  const { token } = useAuth(); // Получаем токен из хука аутентификации
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]); // Стейт для хранения списка способов оплаты
  const [loading, setLoading] = useState<boolean>(true); // Стейт загрузки
  const [error, setError] = useState<string | null>(null); // Стейт для ошибок

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!token) {
        setError("Token not available");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://217.114.14.99:8080/api-payment/api/v1/payment_type/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем Bearer токен в заголовок
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment methods");
        }

        const data = await response.json();
        setPaymentMethods(data); // Сохраняем данные о способах оплаты в стейт
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchPaymentMethods();
  }, [token]); // Выполняем запрос, когда появляется токен

  if (loading) return <p>Loading payment methods...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Payment Methods</h3>
      <div className="mt-2 flex flex-col gap-3">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div key={method.id} className="items-top space-x-2 border border-[#E4E4E7] hover:border-[#000000] ease-in-out duration-300 rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id={method.name}
                    name="paymentMethod"
                    // Вы можете использовать другую логику для выбора метода
                    onChange={() => console.log("Selected payment method:", method.name)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor={method.name} className="text-sm font-medium leading-none">
                      {method.name} {/* Дисплей названия способа оплаты */}
                    </label>
                    <p className="text-sm text-muted-foreground">{method.description}</p> {/* Описание способа */}
                  </div>
                </div>
                <div>
                  <Badge variant={"bold"}>{method.fee_percentage}% fee</Badge> {/* Используем процент комиссии */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No payment methods available</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
