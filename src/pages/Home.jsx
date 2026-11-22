// Home component displays the store landing page and manages category selection.
import { Link } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../api";
import useFetch from "../hooks/useFetch";

export default function Home({ store, loading, error }) {
//Trace the category selected by the user.
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetches products from the API and tracks loading and error states.
    const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useFetch(`${API_URL}/products`);

  //loading condition displays a loading message while store and product data are being fetched.
  if (loading || productsLoading) {
    return <section className="page">Loading...</section>;
  }

  // Error condition displays an error message if there was an issue loading the store or products.
  if (error || productsError) {
    return (
      <section className="page">
        <p role="alert">Something went wrong while loading the store.</p>
      </section>
    );
  }
  
// Selects the first six products to display as featured products.
  const featuredProducts = Array.isArray(products)
    ? products.slice(0, 6)
    : [];

//list of categories for users to browse products by category.
  const categories = [
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets",
    "Watches",
    "Cufflinks",
  ];

//Filters products by the selected category 

  const displayProducts = selectedCategory
  ? (Array.isArray(products) ? products : []).filter(
      (product) =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
    )
  : featuredProducts;

  return (
    <section className="page">
      {/* Hero Section */}

      <section className="hero">
        <div className="hero-content">
          <p>{store?.name}</p>

          <h1>Elegance in Every Detail.</h1>

          <p>{store?.tagline}</p>

          <p>{store?.description}</p>

          <Link to="/products" className="btn">
            Browse Products
          </Link>

          <Link to="/products/new" className="btn">
            Add Products
          </Link>
        </div>
      </section>

      {/* Shop by Category  allows users to browse products by category */}

      <section className="categories">
        <h2>Shop by Category</h2>
        <button
            type="button"
            className="show-all-btn"
            onClick={() => setSelectedCategory(null)}
          >
            Show All
          </button>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

{/* Featured Products displays products and links to their details. */} 

      <section className="featured-products">
        <h2>Featured Products</h2>

        <div className="product-grid">
          {displayProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p>{product.category}</p>

              <p>{product.material}</p>

              <p>{product.price}</p>

              <Link to={`/products/${product.id}`}>
                View Product
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
