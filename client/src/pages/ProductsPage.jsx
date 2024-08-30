// Sử dụng React Query
import { useQuery } from "react-query";
import ProductItem from "../components/ProductItem";

const fetchProducts = async () => {
  const { data } = await axios.get("/api/products");
  return data;
};

const ProductsPage = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery("products", fetchProducts);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
