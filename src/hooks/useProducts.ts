import { useEffect, useState } from "react";
import { apiRoutes } from "@/config/apiConfig";
import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

interface PriceOption {
  price: string;
  count: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  active: boolean;
  priceOptions: PriceOption[];
  site: string;
  avatar: string;
}

const API_URL = apiRoutes.products;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async (token: string) => {
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const baseUrl = "https://collaboo.co";
        const mappedProducts = data.map((item: any) => {
          const origin = item.origins?.[0];

          console.log("origin.picture from backend:", origin?.picture);

          const rawPicture = (origin?.picture || "").trim();
          let avatar = "";
          if (rawPicture.startsWith("http")) {
            avatar = rawPicture;
          } else if (rawPicture.startsWith("/")) {
            avatar = `${baseUrl}${rawPicture}`;
          } else {
            avatar = `${baseUrl}/${rawPicture}`;
          }

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            active: item.status === "shown",
            site: origin?.site || "",
            avatar,
            priceOptions: item.price_table.map((price: any) => ({
              price: price.amount,
              count: price.duration.replace(/mons?$/, "month"),
            })),
          };
        });

        setProducts(mappedProducts);
        localStorage.setItem("products", JSON.stringify(mappedProducts));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await getIdToken(user, true);
        await fetchProducts(token);
        setIsAuthReady(true);
      } else {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await getIdToken(user, true);
            await fetchProducts(token);
          }
          setIsAuthReady(true);
        });
      }
    };

    checkAuth();
  }, []);

  return { products, loading, error, isAuthReady };
}
