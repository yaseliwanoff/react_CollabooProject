import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import Product from "@/components/product";
import { InputSearch } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Фильтрация товаров
  const filteredProducts = products.filter((product) => {
    const matchesActiveTab =
      activeTab === "all" ||
      (activeTab === "active" && product.active) ||
      (activeTab === "inactive" && !product.active);

    const matchesSearchTerm = searchTerm.trim() === "" || product.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesActiveTab && matchesSearchTerm;
  });

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mt-[32px] block md:flex items-center justify-between">
        <div className="lg:hidden mb-3 mt-3 lg:mt-0 lg:mb-0">
          <InputSearch
            type="text"
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
      </div>

      {/* Отображение товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product
              key={product.id}
              avatar="/default-avatar.png"
              title={product.title}
              description={product.description}
              active={product.active}
              priceOptions={product.priceOptions}
              onOrderClick={(p) => console.log("Ordered:", p)}
            />
          ))
        ) : (
          <p className="text-center col-span-3">No products found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
