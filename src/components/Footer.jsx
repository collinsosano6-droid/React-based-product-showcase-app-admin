import { Link } from "react-router-dom";

export default function Footer({ store, loading, error }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section aria-labelledby="footer-about">
          <h2 id="footer-about" className="site-footer__title">
            {store?.name ?? "Merc Jewelry"}
          </h2>
          <p>{loading ? "Loading store details..." : store?.tagline}</p>
          {store?.description && <p className="site-footer__muted">{store.description}</p>}
        </section>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="site-footer__title">Contact</h2>
          {error ? (
            <p role="alert">Store details are unavailable right now.</p>
          ) : (
            <ul className="site-footer__list">
              {store?.phone_number && <li><a href={`tel:${store.phone_number}`}>{store.phone_number}</a></li>}
              {store?.email && <li><a href={`mailto:${store.email}`}>{store.email}</a></li>}
              {store?.address && <li>{store.address}</li>}
              {store?.hours && <li>{store.hours}</li>}
            </ul>
          )}
        </section>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="site-footer__title">Quick links</h2>
          <ul className="site-footer__list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/products/new">Add product</Link></li>
          </ul>
        </nav>
      </div>

      <p className="site-footer__legal">
        &copy; {year} {store?.name ?? "Merc Jewelry"}. All rights reserved.
      </p>
    </footer>
  );
}