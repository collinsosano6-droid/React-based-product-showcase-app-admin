import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import ProductList from "../pages/ProductList";
import useFetch from "../hooks/useFetch";
import { API_URL } from "../api";

// Mocking the useFetch hook

vi.mock("../hooks/useFetch", () => ({
  default: vi.fn(),
}));

// Sampling products for testing
const mockProducts = [
  {
    id: 1,
    name: "Solitaire Ring",
    category: "Rings",
    material: "18k Gold",
    price: 1250,
    stock: 6,
    image: "/images/solitaire-ring.png",
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    category: "Earrings",
    material: "Sterling Silver",
    price: 180,
    stock: 14,
    image: "/images/pearl-drop-earrings.png",
  },
  {
    id: 3,
    name: "Tennis Bracelet",
    category: "Bracelets",
    material: "Platinum",
    price: 2100,
    stock: 3,
    image: "/images/tennis-bracelet.png",
  },
];

// Helper: function to render ProductList
function renderProductList() {
  return render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>
  );
}

describe("ProductList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useFetch.mockReturnValue({
      data: mockProducts,
      loading: false,
      error: null,
    });
  });

  
  // Test A: Checking of an API endpoint
  it("fetches products using the correct API endpoint", () => {
    renderProductList();

    expect(useFetch).toHaveBeenCalledWith(
      `${API_URL}/products`
    );
  });

  // Test B: Checking for heading of the page
  it("displays the Products heading", () => {
    renderProductList();

    expect(
      screen.getByRole("heading", { name: "Products" })
    ).toBeTruthy();
  });

  // Test C: Display of all products
  it("displays the available products", () => {
    renderProductList();

    expect(screen.getByText("Solitaire Ring")).toBeTruthy();
    expect(screen.getByText("Pearl Drop Earrings")).toBeTruthy();
    expect(screen.getByText("Tennis Bracelet")).toBeTruthy();
  });

  // Test D: Displaying loading state
  it("displays a loading message while fetching products", () => {
    useFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    renderProductList();

    expect(
      screen.getByText("Loading products...")
    ).toBeTruthy();
  });

  // Test E: Displaying error state
  it("displays an error message when fetching fails", () => {
    useFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to load products",
    });

    renderProductList();

    expect(
      screen.getByText("Failed to load products")
    ).toBeTruthy();
  });

  // Test F: Searching of products by name
  it("filters products by name", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "Solitaire" },
    });

    expect(screen.getByText("Solitaire Ring")).toBeTruthy();

    expect(
      screen.queryByText("Pearl Drop Earrings")
    ).toBeNull();
  });

  // Test G: Searching of products by its category
  it("filters products by category", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "Bracelets" },
    });

    expect(screen.getByText("Tennis Bracelet")).toBeTruthy();

    expect(
      screen.queryByText("Solitaire Ring")
    ).toBeNull();
  });

  // Test H: Searching of products by material
  it("filters products by material", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "Platinum" },
    });

    expect(screen.getByText("Tennis Bracelet")).toBeTruthy();

    expect(
      screen.queryByText("Solitaire Ring")
    ).toBeNull();
  });

  // Test I: Searching Case-insensitive
  it("supports case-insensitive product searches", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "solitaire" },
    });

    expect(screen.getByText("Solitaire Ring")).toBeTruthy();
  });

  // Test J: Empty search results
  it("displays a message when no products match the search", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "Diamond Watch" },
    });

    expect(
      screen.getByText("No products found.")
    ).toBeTruthy();
  });

    // Test K: Clearing the search input
  it("displays all products when the search is cleared", () => {
    renderProductList();

    const searchInput = screen.getByRole("searchbox");

    // Search for one product
    fireEvent.change(searchInput, {
      target: { value: "Solitaire" },
    });

    // Confirm other products are hidden
    expect(screen.queryByText("Pearl Drop Earrings")).toBeNull();

    // Clear the search
    fireEvent.change(searchInput, {
      target: { value: "" },
    });

    // Confirm all products appear again
    expect(screen.getByText("Solitaire Ring")).toBeTruthy();
    expect(screen.getByText("Pearl Drop Earrings")).toBeTruthy();
    expect(screen.getByText("Tennis Bracelet")).toBeTruthy();
  });

  // Test L: One card per product
  it("renders one ProductCard for each product available product", () => {
    const { container } = renderProductList();

    const productCards = container.querySelectorAll(
      ".product-card"
    );

    expect(productCards.length).toBe(mockProducts.length);
  }); 
});