import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // CHANGED in commit 8: added useNavigate
import { API_URL } from "../api";
import useFetch from "../hooks/useFetch";

const CATEGORIES = ["Rings", "Necklaces", "Earrings", "Bracelets", "Watches", "Cufflinks"];

// Turn a product from the server into values the form inputs can hold (text)
function toForm(product) {
  return {
    name: product.name ?? "",
    description: product.description ?? "",
    category: product.category ?? "",
    material: product.material ?? "",
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
    image: product.image ?? "",
  };
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // NEW in commit 8: lets us leave the page after deleting
  const { data, loading, error } = useFetch(`${API_URL}/products/${id}`);

  const [product, setProduct] = useState(null); // the saved product
  const [form, setForm] = useState(null); // what is typed in the inputs
  const [imageFailed, setImageFailed] = useState(false);
  const [errors, setErrors] = useState([]); // validation and server error messages
  const [message, setMessage] = useState(""); // "Changes saved." message

  // When the product arrives from the server, fill the page and the form
  useEffect(() => {
    if (data) {
      setProduct(data);
      setForm(toForm(data));
      setImageFailed(false);
    }
  }, [data]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(""); // hide the old message while the user types
  }

  // Runs when the form is submitted: check the values, then save with PATCH
  async function handleSave(e) {
    e.preventDefault(); // stop the browser from reloading the page

    const price = Number(form.price);
    const stock = Number(form.stock);
    const problems = [];

    if (!form.name.trim()) problems.push("Name is required");
    if (!form.category) problems.push("Category is required");
    if (!form.material.trim()) problems.push("Material is required");
    if (!(price > 0)) problems.push("Price must be a number above 0");
    if (String(form.stock).trim() === "" || !Number.isInteger(stock) || stock < 0) {
      problems.push("Stock must be a whole number, 0 or more");
    }

    setErrors(problems);
    setMessage("");
    if (problems.length > 0) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description,
          category: form.category,
          material: form.material.trim(),
          price,
          stock,
          image: form.image.trim(),
        }),
      });

      if (!response.ok) throw new Error("Could not save the changes. Please try again.");

      const updated = await response.json();
      setProduct(updated); // updates the heading, breadcrumb and image
      setForm(toForm(updated));
      setImageFailed(false);
      setMessage("Changes saved.");
    } catch (err) {
      setErrors([err.message]);
    }
  }

  // NEW in commit 8: delete the product, then go back to the list
  async function handleDelete() {
    // Ask first. If the user clicks Cancel, do nothing.
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete the product. Please try again.");
      navigate("/products"); // go back to the product list
    } catch (err) {
      setErrors([err.message]);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading product...</p>
      </section>
    );
  }

  if (error || !product || !form) {
    return (
      <section className="page">
        <h1>Product not found</h1>
        <p>We could not find this product. It may have been deleted.</p>
        <Link className="btn" to="/products">Back to products</Link>
      </section>
    );
  }

  const showImage = product.image && !imageFailed;

  return (
    <section className="page">
      <p className="breadcrumb">
        <Link to="/products">Products</Link> / {product.name}
      </p>

      <div className="detail">
        <div className="card">
          {showImage ? (
            <img
              className="detail__image"
              src={product.image}
              alt={`${product.name}, ${product.material} ${product.category.toLowerCase()}`}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="detail__image detail__image--empty">{product.name}</div>
          )}
        </div>

        <form className="card" onSubmit={handleSave}>
          <h1 className="detail__title">{product.name}</h1>

          {errors.length > 0 && (
            <ul role="alert" className="notice notice--error">
              {errors.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          )}

          {message && (
            <p role="status" className="notice notice--success">{message}</p>
          )}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="two">
            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="material">Material</label>
              <input id="material" name="material" value={form.material} onChange={handleChange} />
            </div>
          </div>

          <div className="two">
            <div className="field">
              <label htmlFor="price">Price (USD)</label>
              <input id="price" name="price" value={form.price} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="stock">Stock</label>
              <input id="stock" name="stock" value={form.stock} onChange={handleChange} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="image">Image URL</label>
            <input id="image" name="image" value={form.image} onChange={handleChange} />
          </div>

          <div className="row">
            <button className="btn" type="submit">Save changes</button>
            {/* NEW in commit 8: Delete button */}
            <button className="btn btn--danger" type="button" onClick={handleDelete}>
              Delete product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}