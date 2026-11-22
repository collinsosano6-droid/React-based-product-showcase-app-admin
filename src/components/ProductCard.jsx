
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const isLowStock = Number(product.stock) < 5;

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
      </div>

      <div className="product-card__content">
        <p className="product-card__category">
          {product.category}
        </p>

        <h2 className="product-card__name">
          {product.name}
        </h2>

        <p className="product-card__material">
          Material: {product.material}
        </p>

        <p className="product-card__price">
          Price: {Number(product.price).toLocaleString()}
        </p>

        <div className="product-card__footer">
          <span
            className={`product-card__stock ${
              isLowStock ? "product-card__stock--low" : ""
            }`}
          >
            {isLowStock
              ? "Low stock"
              : `${product.stock} in stock`}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="product-card__manage"
          >
            Manage
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
