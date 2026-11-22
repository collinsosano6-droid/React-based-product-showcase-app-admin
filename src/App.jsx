import { Routes, Route } from "react-router-dom";
import { API_URL } from "./api";
import useFetch from "./hooks/useFetch";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  const { data: store, loading, error } = useFetch(`${API_URL}/store_info/1`);

  return (
    <div className="app">
      <Header store={store} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home  store ={store}loading ={loading} error={error}/>} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer store={store} loading={loading} error={error} />
    </div>
  );
}