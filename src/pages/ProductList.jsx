
import { useState } from "react";
import { API_URL } from "../api";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import "./ProductList.css";

  // Import API_URL to access the backend API.
  // Reuse the existing useFetch custom hook.
  // Send a GET request to the /products endpoint.
  // Retrieve product data, loading status and error status.

function ProductList() {
   const { data: products, loading, error } = useFetch(
    `${API_URL}/products`
  );
// Import useState from React.
// Initialize searchTerm as an empty string.
// Use setSearchTerm to update the search input.
// Prepare the component for controlled search functionality.

  const [searchTerm, setSearchTerm] = useState("");

// Filter the products based on the search term.
// Convert search text to lowercase for case-insensitive matching.
// Remove unnecessary spaces using trim().
// Search products by name, category and material.
// Handle an initially empty product response safely.

  const filteredProducts = (products ?? []).filter((product) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.material.toLowerCase().includes(search)
    );
  });

  return (
    <section className="page product-list">
      <h1>Products</h1>

      <p>Browse and search products in the Merc collection.</p>
      <div className="product-list__search">
        <label htmlFor="product-search">Search products</label>

        <input
          id="product-search"
          type="search"
          placeholder="Search by name, category or material..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p className="product-list__error">{error}</p>}

      {!loading && !error && (
        <>
          <p>
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p>No products found.</p>
          )}
        </>
      )}
    </section>
  );
}

export default ProductList;