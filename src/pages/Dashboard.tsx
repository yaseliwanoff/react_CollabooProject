import React, { useState } from "react";
import Banner from "@/components/ui/banner";
import Ticket from "@/assets/images/svg/Ticket.svg";
import ArrowRight from "@/assets/images/svg/ArrowRight.svg";
import MobbinAvatar from "@/assets/images/svg/mobbin-avatar.svg";
import UxMovement from "@/assets/images/svg/ux-movement.svg";
import { Input } from "@/components/ui/search-input";
import Product from "@/components/product";
import PurchasedProduct from "@/components/PurchasedProduct";
import Search from "@/assets/images/svg/search.svg";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  // ... другие продукты
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState<any[]>([]); // Состояние для хранения купленных подписок

  const handleOrderClick = (product: any) => {
    const { title, description, priceOptions, avatar } = product;
    setPurchasedSubscriptions((prev) => [...prev, { title, description, priceOptions, avatar }]);
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
            <button className="button-sidebar">Subscriptions</button>
            <button className="button-sidebar">Payments</button>
          </aside>
          <div className="flex-1 bg-[#FBFBFB]">
            {purchasedSubscriptions.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold text-[24px]">Purchased subscriptions</h2>
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
              </div>
            )}
            <div>
              <Banner
                title="You don’t have any active subscriptions"
                text="You can get access to any service with 1 click"
                button1={{ label: 'Activate coupon', image: Ticket}}
                button2={{ label: 'View plans', image: ArrowRight}}
              />
            </div>
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
                <Input 
                  type="text" 
                  image={Search} 
                  placeholder="Search" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
