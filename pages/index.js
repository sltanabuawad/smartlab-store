import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    name: "iPhone 14",
    price: 899,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 2,
    name: "Samsung S23",
    price: 799,
    image: "https://via.placeholder.com/200"
  }
];

export default function Home() {
  return (
    <div style={{padding:"40px"}}>
      <h1>SmartLab Store</h1>
      <div style={{display:"flex",gap:"20px"}}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}