import { useState, useMemo, useEffect } from "react";
import Banner from "@/components/ui/banner";
import axios from 'axios';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PaymentMethods from "@/components/PaymentMethods";
import { InputSearch } from "@/components/ui/search-input";
import { Input } from "@/components/ui/input";
import Product from "@/components/product";
import PurchasedProduct from "@/components/PurchasedProduct";
import Search from "@/assets/images/svg/search.svg";
import { useProducts } from "@/hooks/useProducts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface PriceOption {
  id: number;
  price: string;
  count: string;
}

// interface ProductType {
//   id: number;
//   avatar: string;
//   title: string;
//   description: string;
//   active: boolean;
//   priceOptions: PriceOption[];
// }

interface PaymentMethod {
  gateway: string;
  fee_percentage: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_active: boolean;
  is_hidden: boolean;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState<any[]>([]);
  const [statusTexts] = useState<string[]>(Array(5).fill("Expired"));
  const data = [
    { date: "04.02.2025", subscription: "#p1502251 Mobbin - 1 month", price: "3$" },
    { date: "01.12.2024", subscription: "#p1502251 Mobbin - 1 month", price: "3$" },
    { date: "01.11.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "3$" },
    { date: "01.10.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "3$" },
    { date: "14.07.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "Free" },
  ];

  const [activeSection, setActiveSection] = useState("subscriptions");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loadingText] = useState("Complete payment in another tab");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { products, loading } = useProducts();
  const [isOptionManuallySelected, setIsOptionManuallySelected] = useState(false);

  // Используем useState для выбранной опции подписки
  const [selectedProduct, setSelectedProduct] = useState<any>(null); 
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);

  const isPaymentMethodSelected = selectedPaymentMethod !== null;
  // const isSubscriptionSelected = selectedOption !== null;

  // Функции обработки
  const handleBlockClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  // функция для обработки платежа
  const handleMakePayment = async () => {
    if (!selectedPaymentMethod || !selectedOption || !selectedProduct) return;

    setIsLoading(true);

    try {
      const paymentPayload = {
        subscription_price_id: Number(selectedOption.id),
        gateway: selectedPaymentMethod.gateway,
        amount_usd: parseFloat(selectedOption.price), // это работает ТОЛЬКО если цена в ДОЛЛАРАХ!
        amount_rub: parseFloat(selectedOption.price) * 75, // конвертация в РУБЛИ!
        promocode: "",
        status: "created",
        commission: processingFee,
        gateway_payment_id: "", // это трубется или нет?
        arbitrary_data: {}, // нужно передовать доп данные и какие?
      };

      const response = await axios.post(
        'https://collaboo.co/api-payment/api/v1/payment-form/', 
        paymentPayload
      );

      // Получаем наш уникальный payment URL
      const paymentUrl = response.data.url;

      if (paymentUrl) {
        console.log("Redirecting to payment URL:", paymentUrl);
        window.open(paymentUrl, "_blank");
      } else {
        alert("Payment URL not found.");
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPurchasedSubscriptions = async () => {
      try {
        const response = await axios.get("https://collaboo.co/api-subs/api/v1/sub-layout/get_active_sub");
        setPurchasedSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch purchased subscriptions:", error);
      }
    };
  
    fetchPurchasedSubscriptions();
  }, []);  


  // const handlePaymentMethodChange = (method: string) => {
  //   setSelectedPaymentMethod(method);
  // };

  const subscriptionPrice = useMemo(() => {
    return selectedOption ? parseFloat(selectedOption.price) : 0;
  }, [selectedOption]);
  
  const processingFee = useMemo(() => {
    if (
      !selectedPaymentMethod ||
      !selectedOption ||
      !isOptionManuallySelected ||
      typeof selectedPaymentMethod.fee_percentage !== "number"
    ) {
      return 0;
    }
  
    const feeRate = selectedPaymentMethod.fee_percentage / 100;
    return +(subscriptionPrice * feeRate).toFixed(2);
  }, [selectedPaymentMethod, subscriptionPrice, isOptionManuallySelected]);  
  
  const totalAmount = useMemo(() => {
    return (subscriptionPrice + processingFee).toFixed(2);
  }, [subscriptionPrice, processingFee]);  

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
    setIsOptionManuallySelected(false);

    if (product.priceOptions && product.priceOptions.length > 0) {
      setSelectedOption(product.priceOptions[0]);
    } else {
      setSelectedOption(null);
    }
  };

  const handleCancel = () => {
    setIsLoading(false);
    setSelectedPaymentMethod(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesActiveTab =
      activeTab === "all" ||
      (activeTab === "active" && product.active) ||
      (activeTab === "inactive" && !product.active);

    const matchesSearchTerm = searchTerm.trim() === "" || product.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesActiveTab && matchesSearchTerm;
  });

  // Error handling in case of failed API call
  if (loading) return <p>Loading products...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  const handlePaymentMethodChange = (method: any) => {
    setSelectedPaymentMethod(method);
  };  
  

  // const subscriptionPrice = selectedOption ? parseFloat(selectedOption.price) : 0;
  // const processingFee = isOptionManuallySelected ? (subscriptionPrice * 0.05).toFixed(2) : null;
  // const totalAmount = isOptionManuallySelected
  //   ? (subscriptionPrice + parseFloat(processingFee!)).toFixed(2)
  //   : subscriptionPrice.toFixed(2);

  return (
    <section className="container bg-[#FBFBFB] text-[#1B1B1B]">
      <div className="pt-[55px]">
        <div className="w-full pt-10 mb-8">
          <h1 className="font-semibold text-[30px]">Dashboard</h1>
        </div>
        <div className="block lg:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px]">
            <button className="button-sidebar" onClick={() => setActiveSection("subscriptions")}>Subscriptions</button>
            <button className="button-sidebar" onClick={() => setActiveSection("payments")}>Payments</button>
          </aside>
          <aside className="flex lg:hidden">
            <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all" onClick={() => setActiveSection("subscriptions")}>Subscriptions</TabsTrigger>
                      <TabsTrigger value="active" onClick={() => setActiveSection("payments")}>Payments</TabsTrigger>
                    </TabsList>
                  </Tabs>
          </aside>
          <div className="flex-1 bg-[#FBFBFB]">
            {activeSection === "subscriptions" && purchasedSubscriptions.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold text-[20px]">Purchased subscriptions</h2>
                <p className="opacity-60 font-normal text-[14px]">Full list of subscriptions you have.</p>
                <div className="flex flex-wrap mt-5 gap-[13px]">
                  {purchasedSubscriptions.map((sub, index) => (
                    <PurchasedProduct
                      key={index}
                      title={sub.title}
                      description={sub.description}
                      avatar={sub.links[0]?.href || ""}
                      date_end={sub.date_end}
                      links={sub.links}
                    />              
                  ))}
                </div>
                <div className='w-[100%] h-[1px] bg-[#E4E4E7] my-[32px]'></div>
              </div>
            )}
            {activeSection === "subscriptions" && (
              <div>
                <Banner
                  title="You don’t have any active subscriptions"
                  text="You can get access to any service with 1 click"
                  button1={{ 
                    label: 'Activate coupon', 
                    image: (
                      <svg className="icon coupon-icon" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.66634 1.33325V2.66659M8.66634 9.33325V10.6666M8.66634 5.33325V6.66659M1.33301 3.99992C1.86344 3.99992 2.37215 4.21063 2.74722 4.5857C3.12229 4.96078 3.33301 5.46949 3.33301 5.99992C3.33301 6.53035 3.12229 7.03906 2.74722 7.41413C2.37215 7.78921 1.86344 7.99992 1.33301 7.99992V9.33325C1.33301 9.68687 1.47348 10.026 1.72353 10.2761C1.97358 10.5261 2.31272 10.6666 2.66634 10.6666H13.333C13.6866 10.6666 14.0258 10.5261 14.2758 10.2761C14.5259 10.026 14.6663 9.68687 14.6663 9.33325V7.99992C14.1359 7.99992 13.6272 7.78921 13.2521 7.41413C12.8771 7.03906 12.6663 6.53035 12.6663 5.99992C12.6663 5.46949 12.8771 4.96078 13.2521 4.5857C13.6272 4.21063 14.1359 3.99992 14.6663 3.99992V2.66659C14.6663 2.31296 14.5259 1.97382 14.2758 1.72378C14.0258 1.47373 13.6866 1.33325 13.333 1.33325H2.66634C2.31272 1.33325 1.97358 1.47373 1.72353 1.72378C1.47348 1.97382 1.33301 2.31296 1.33301 2.66659V3.99992Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )
                  }}
                  button2={{ 
                    label: 'View plans', 
                    image: (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.33301 7.99992H12.6663M12.6663 7.99992L7.99967 3.33325M12.6663 7.99992L7.99967 12.6666" stroke="#18181B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  }}
                />
              </div>
            )}
            {activeSection === "subscriptions" && (
              <div className="mt-[32px] block md:flex items-center justify-between">
                <div className="lg:hidden mb-3 mt-3 lg:mt-0 lg:mb-0">
                  <InputSearch 
                    type="text" 
                    image={Search} 
                    placeholder="Search" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <div>
                  <Tabs defaultValue="all" className="w-full pb-4 md:pb-0 md:w-[400px]" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="hidden lg:block">
                  <InputSearch 
                    type="text" 
                    image={Search} 
                    placeholder="Search" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
              </div>
            )}
            {activeSection === "subscriptions" && (
              <div className="flex flex-wrap mt-5 gap-[13px]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Product
                      key={product.id}
                      avatar={product.avatar}
                      title={product.title}
                      description={product.description}
                      site={product.site}
                      active={product.active}
                      priceOptions={product.priceOptions}
                      onOrderClick={handleOrderClick}
                    />
                  ))
                ) : (
                  <div>No products available</div>
                )}
              </div>
            )}
            {activeSection === "payments" && (
              <div className="block md:hidden">
                {data.map((row, index) => (
                  <div
                    key={index}
                    onClick={() => handleBlockClick(index)}
                    className="flex flex-col p-4 w-full mb-4 rounded-[12px] border border-[] bg-white shadow cursor-pointer"
                  >
                    <h5 className="font-semibold text-[16px]">{row.subscription}</h5>
                    <div className="flex justify-between mt-3 items-center">
                      <span className="text-[14px] text-[#71717A]">Date</span>
                      <span className="text-[14px]">{row.date}</span>
                    </div>
                    <div className="flex justify-between mt-3 items-center">
                      <span className="text-[14px] text-[#71717A]">Price</span>
                      <span className="text-[14px]">{row.price}</span>
                    </div>
                    <div className="flex justify-between mt-3 items-center">
                      <span className="text-[14px] text-[#71717A]">Status</span>
                      <span className="text-[14px]">{activeIndex === index ? 'Pending' : statusTexts[index]}</span>
                    </div>
                    {activeIndex === index && (
                      <div className="mt-4">
                        <Button className="float-right">Open</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}
              {activeSection === "payments" && (
              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell>{row.subscription}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell className="text-right">
                        {activeIndex === index ? 'Pending' : statusTexts[index]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
          </div>
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) {
          setSelectedOption(null);
          setSelectedPaymentMethod(null);
        }
      }}>
        <SheetContent side="bottom">
          {isLoading ? (
            <>
              {/* Состояние загрузки */}
              <SheetHeader>
                <div className="container2">
                  <div className="flex gap-3">
                    <div>
                      <img src={selectedProduct ? selectedProduct.avatar : ""} alt="Product Avatar" className="w-16 h-16 rounded-full" />
                    </div>
                    <div>
                      <div>
                        <SheetTitle>{selectedProduct ? selectedProduct.title : "Product Details"}</SheetTitle>
                      </div>
                      <div className="w-[230px] md:w-[450px]">
                        <SheetDescription>{selectedProduct ? selectedProduct.description : "No description available."}</SheetDescription>
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] h-[1px] bg-[#E4E4E7] mt-[32px]"></div>
                </div>
              </SheetHeader>
              <div className="flex justify-center items-center h-[500px]">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="loader"></div>
                  <div className="w-[318px]">
                    <div className="flex flex-col justify-center items-center mb-4">
                      <p>{loadingText}</p>
                    </div>
                    <div>
                      <Button variant={"full_light"} onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Контент при завершении загрузки */}
              <SheetHeader>
                <div className="container2">
                  <div className="flex gap-3">
                    <div>
                      <img src={selectedProduct ? selectedProduct.avatar : ""} alt="Product Avatar" className="w-16 h-16 rounded-full" />
                    </div>
                    <div>
                      <div>
                        <SheetTitle>{selectedProduct ? selectedProduct.title : "Product Details"}</SheetTitle>
                      </div>
                      <div className="w-[230px] md:w-full">
                        <SheetDescription>{selectedProduct ? selectedProduct.description : "No description available."}</SheetDescription>
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] h-[1px] bg-[#E4E4E7] mt-[32px]"></div>
                </div>
              </SheetHeader>
              <div className="container2">
                <div className="md:flex px-5 md:px-0 justify-between items-end">
                  <div>
                    <div className="mt-4">
                      <h3 className="font-semibold">Subscription period</h3>
                      {selectedProduct && selectedProduct.priceOptions.length > 0 && (
                        <div className="flex flex-col mt-2">
                          <Tabs className="w-full md:w-[476px]" value={selectedOption?.count || ""}>
                            <TabsList
                              className={cn(
                                "grid w-full h-[58px]",
                                selectedProduct.priceOptions.length === 1 && "grid-cols-1",
                                selectedProduct.priceOptions.length === 2 && "grid-cols-2",
                                selectedProduct.priceOptions.length >= 3 && "grid-cols-3"
                              )}
                            >
                              {selectedProduct.priceOptions.map((option: PriceOption, index: number) => (
                                <TabsTrigger 
                                  key={index} 
                                  value={option.count} 
                                  onClick={() => {
                                    setSelectedOption(option);
                                    setIsOptionManuallySelected(true);
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[14px]">{option.count}</span>
                                    <span className="text-[#71717A] text-[12px] font-normal">{option.price}$/month</span>
                                  </div>
                                </TabsTrigger>
                              ))}
                            </TabsList>
                          </Tabs>
                        </div>
                      )}
                    </div>
                    <div className='w-[100%] h-[1px] bg-[#E4E4E7] my-[32px]'></div>
                    <PaymentMethods onPaymentMethodChange={handlePaymentMethodChange} />
                  </div>
                  <div className="bg-[#F4F4F5] mt-7 md:mt-0 w-full md:w-[364px] h-auto md:h-[750px] px-6 py-6 rounded-[6px] border border-[#E4E4E7] flex flex-col">
                    <div>
                      <h3 className="font-semibold">Have a promo code or coupon?</h3>
                      <div className="flex gap-2 mt-2">
                        <Input placeholder="Enter code…"></Input>
                        <Button variant={"default"}>Apply</Button>
                      </div>
                    </div>

                    {selectedOption && (
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <p>Order</p>
                          <p>${subscriptionPrice}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Processing fee ({selectedPaymentMethod?.fee_percentage || 0}%)</p>
                          <p>{isOptionManuallySelected ? `$${processingFee}` : '—'}</p>
                        </div>
                        <div className="flex justify-between font-semibold text-[18px] mt-4">
                          <p>Total</p>
                          <p>${totalAmount}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-5 md:mt-auto">
                      <Button variant={"default"} onClick={handleMakePayment} disabled={!isPaymentMethodSelected}>
                        Make payment
                      </Button>
                      <Button variant={"light"} onClick={() => setIsSheetOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </section>
  );
}

export default Dashboard;
