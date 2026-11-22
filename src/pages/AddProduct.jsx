import { useState } from 'react';
import { API_URL } from '../api';
import './AddProduct.css';

// Available product categories
const CATEGORIES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Watches',
  'Cufflinks',
];

function AddProduct({ onAdd }) {
  // Manage each product input value using React state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Prepare the new product data
    const newProduct = {
      name,
      description,
      category,
      material,
      price: Number(price),
      stock: Number(stock),
      image,
    };

    // Send product data to the backend
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add product');
        }
        return res.json();
      })
      .then((data) => {
        // Notify the parent component
        onAdd?.(data);

        // Clear all form fields
        setName('');
        setDescription('');
        setCategory('');
        setMaterial('');
        setPrice('');
        setStock('');
        setImage('');
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        setError('Could not add the product. Please try again.');
      });
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <p className="Form-subtitle">
        Fill in the details below to add a new product to the store.
      </p>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="category">Category</label>

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="material">Material</label>
          <input
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="image">Image</label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddProduct;
