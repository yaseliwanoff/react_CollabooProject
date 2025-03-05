import React, { useState } from "react";
import Banner from "@/components/ui/banner";
import Ticket from "@/assets/images/svg/Ticket.svg";
import { Button } from "@/components/ui/button";
import ArrowRight from "@/assets/images/svg/ArrowRight.svg";
import MobbinAvatar from "@/assets/images/svg/mobbin-avatar.svg";
import UxMovement from "@/assets/images/svg/ux-movement.svg";
import { InputSearch } from "@/components/ui/search-input";
import { Input } from "@/components/ui/input";
import Product from "@/components/product";
import PurchasedProduct from "@/components/PurchasedProduct";
import { Badge } from "@/components/ui/badge";
import Search from "@/assets/images/svg/search.svg";
import PayPal from "@/assets/images/svg/paypal.svg";
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

// Временные тестовые данные
const productData = [
  {
    id: 0,
    active: true,
    avatar: MobbinAvatar,
    title: "Mobbin",
    description: "Discover real-world design inspiration. Featuring over 300,000 screens and 1,000 iOS, Android & Web apps — New content every week.",
    priceOptions: [
      { price: "3", count: "1" },
      { price: "2", count: "6" },
      { price: "1", count: "12" },
    ],
  },
  {
    id: 1,
    active: false,
    avatar: UxMovement,
    title: "UX Movement",
    description: "A professional publication to teach you how to design interfaces that are user-friendly and intuitive to use.",
    priceOptions: [
      { price: "3", count: "1" },
      { price: "2", count: "6" },
      { price: "1", count: "12" },
    ],
  },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedSubscriptions] = useState<any[]>([]);
  const [statusTexts, setStatusTexts] = useState<string[]>(Array(5).fill("Expired"));
  const data = [
    { date: "04.02.2025", subscription: "#p1502251 Mobbin - 1 month", price: "3$" },
    { date: "01.12.2024", subscription: "#p1502251 Mobbin - 1 month", price: "3$" },
    { date: "01.11.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "3$" },
    { date: "01.10.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "3$" },
    { date: "14.07.2024", subscription: "#p1502251 Mobbin - 1 месяц", price: "Free" },
  ];
  const [activeSection, setActiveSection] = useState("subscriptions");
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Состояние для выбранного продукта
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Состояние для управления видимостью Sheet

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product); // Устанавливаем выбранный продукт
    setIsSheetOpen(true); // Открываем Sheet
  };

  const filteredProducts = productData.filter(product => {
    const matchesActiveTab = activeTab === "all" || (activeTab === "active" && product.active) || (activeTab === "inactive" && !product.active);
    const matchesSearchTerm = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesActiveTab && matchesSearchTerm;
  });

  return (
    <section className="bg-[#FBFBFB] text-[#1B1B1B]">
      <div className="container1 pt-[55px]">
        <div className="w-full pt-10 mb-8">
          <h1 className="font-semibold text-[30px]">Dashboard</h1>
        </div>
        <div className="flex h-screen text-[Inter]">
          <aside className="w-1/5 flex flex-col text-[14px]">
            <button className="button-sidebar" onClick={() => setActiveSection("subscriptions")}>Subscriptions</button>
            <button className="button-sidebar" onClick={() => setActiveSection("payments")}>Payments</button>
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
                      avatar={sub.avatar}
                      title={sub.title}
                      description={sub.description}
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
                  button1={{ label: 'Activate coupon', image: Ticket}}
                  button2={{ label: 'View plans', image: ArrowRight}}
                />
              </div>
            )}
            {activeSection === "subscriptions" && (
              <div className="mt-[32px] flex items-center justify-between">
                <div>
                  <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
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
                {filteredProducts.map((productItem) => {
                  return (
                    <Product
                      key={productItem.id}
                      avatar={productItem.avatar}
                      title={productItem.title}
                      description={productItem.description}
                      active={productItem.active}
                      priceOptions={productItem.priceOptions}
                      onOrderClick={handleOrderClick}
                    />
                  );
                })}
              </div>
            )}
            {activeSection === "payments" && (
              <Table>
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
                      <TableCell
                        className="text-right"
                        onMouseEnter={() => {
                          const newStatusTexts = [...statusTexts];
                          newStatusTexts[index] = `Pending… (Open)`;
                          setStatusTexts(newStatusTexts);
                        }}
                        onMouseLeave={() => {
                          const newStatusTexts = [...statusTexts];
                          newStatusTexts[index] = "Expired";
                          setStatusTexts(newStatusTexts);
                        }}
                      >
                        {statusTexts[index]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <div className="container2">
              <div>
                <SheetTitle>{selectedProduct ? selectedProduct.title : "Product Details"}</SheetTitle>
              </div>
              <div>
                <SheetDescription>{selectedProduct ? selectedProduct.description : "No description available."}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="container2">
            <div className="flex justify-between items-end">
              <div>
                <div className="mt-4">
                  <h3 className="font-semibold">Subscription period</h3>
                  <div className="flex flex-col mt-2">
                    <Tabs className="w-[476px]">
                      <TabsList className="grid w-full grid-cols-3 h-[58px]">
                        <TabsTrigger value="month1">
                          <div className="flex flex-col">
                            <span className="text-[14px]">1 month</span>
                            <span className="text-[#71717A] text-[12px] font-normal">3$/month</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="month2">
                          <div className="flex flex-col">
                            <span className="text-[14px]">6 month</span>
                            <span className="text-[#71717A] text-[12px] font-normal">2$/month</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="month3">
                          <div className="flex flex-col">
                            <span className="text-[14px]">12 month</span>
                            <span className="text-[#71717A] text-[12px] font-normal">1$/month</span>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <div className='w-[100%] h-[1px] bg-[#E4E4E7] my-[32px]'></div>
                <div className="mt-4">
                  <h3 className="font-semibold">Payment method (world)</h3>
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="paypal"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === "PayPal"}
                            onChange={() => handlePaymentMethodChange("PayPal")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="paypal"
                              className="text-sm font-medium leading-none"
                            >
                              {PayPal ? (
                                <img src={PayPal} alt="PayPal" />
                              ) : (
                                "PayPal"
                              )}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Any bank card
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>12% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="crypto"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === "Crypto"}
                            onChange={() => handlePaymentMethodChange("Crypto")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="crypto"
                              className="text-sm font-medium leading-none"
                            >
                              Crypto payment
                            </label>
                            <p className="text-sm text-muted-foreground">
                              USDT / TON / ETH / SOL
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>0% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="webmoney"
                            name="paymentMethod"
                            checked={selectedPaymentMethod === "WebMoney"}
                            onChange={() => handlePaymentMethodChange("WebMoney")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="webmoney"
                              className="text-sm font-medium leading-none"
                            >
                              WebMoney
                            </label>
                            <p className="text-sm text-muted-foreground">
                              WMZ, WMT etc.
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>25% fee</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Payment method (world)</h3>
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="sbp_payment"
                            name="paymentMethodcis"
                            checked={selectedPaymentMethod === "sbp_payment"}
                            onChange={() => handlePaymentMethodChange("sbp_payment")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="crypto"
                              className="text-sm font-medium leading-none"
                            >
                              SBP payment 🇷🇺
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Payment by SBP
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>5% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="sbp_transfer"
                            name="paymentMethodcis"
                            checked={selectedPaymentMethod === "sbp_transfer"}
                            onChange={() => handlePaymentMethodChange("sbp_transfer")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="sbp_transfer"
                              className="text-sm font-medium leading-none"
                            >
                              SBP transfer 🇷🇺
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Transfer by phone number
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>10% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="card_payment_ua"
                            name="paymentMethodcis"
                            checked={selectedPaymentMethod === "card_payment_ua"}
                            onChange={() => handlePaymentMethodChange("card_payment_ua")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="card_payment_ua"
                              className="text-sm font-medium leading-none"
                            >
                              Card payment 🇺🇦
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Transfer by card number
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>10% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="card_payment_kzz"
                            name="paymentMethodcis"
                            checked={selectedPaymentMethod === "card_payment_kzz"}
                            onChange={() => handlePaymentMethodChange("card_payment_kzz")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="card_payment_kzz"
                              className="text-sm font-medium leading-none"
                            >
                              Card payment 🇰🇿🇿
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Transfer by card number
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>10% fee</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="items-top space-x-2 border border-[#E4E4E7] rounded-[8px] py-[8px] px-[8px] shadow shadow-black/5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            id="card_payment_uz"
                            name="paymentMethodcis"
                            checked={selectedPaymentMethod === "card_payment_uz"}
                            onChange={() => handlePaymentMethodChange("card_payment_uz")}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="card_payment_uz"
                              className="text-sm font-medium leading-none"
                            >
                              Card transfer 🇺🇿
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Transfer by card number
                            </p>
                          </div>
                        </div>
                        <div>
                          <Badge variant={"bold"}>10% fee</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#F4F4F5] w-[364px] h-[750px] px-6 py-6 rounded-[6px] border border-[#E4E4E7] flex flex-col">
                <div>
                  <h3 className="font-semibold">Have a promo code or coupon?</h3>
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="Enter code…"></Input>
                    <Button variant={"default"}>Apply</Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between">
                    <p>Order</p>
                    <p>$3</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Processing fee (5%)</p>
                    <p>0.45$</p>
                  </div>
                  <div className='w-[100%] h-[1px] my-[20px] bg-[#E4E4E7]'></div>
                  <div className="flex justify-between">
                    <p>Total amount</p>
                    <p className="text-[16px] font-semibold">$364</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <Button variant={"default"}>Make payment</Button>
                  <Button variant={"light"}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default Dashboard;
