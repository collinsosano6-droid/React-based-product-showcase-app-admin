import { NavLink } from "react-router-dom";

const FALLBACK_NAME = "Merc Jewelry";

export default function Header({ store }) {
  const name = store?.name ?? FALLBACK_NAME;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__brand" aria-label={`${name} admin home`}>
          <span className="site-header__name">{name}</span>
          <span className="site-header__badge">Admin</span>
        </NavLink>

        <nav className="site-header__nav" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products" end>Products</NavLink>
          <NavLink to="/products/new">Add product</NavLink>
        </nav>
      </div>
    </header>
  );
}