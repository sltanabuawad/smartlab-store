import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartLab Store</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {products.map(product => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={product.image} width="200" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}