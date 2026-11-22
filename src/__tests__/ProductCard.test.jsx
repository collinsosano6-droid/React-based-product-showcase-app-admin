import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard";

// Sample product data
const mockProduct = {
  id: 1,
  name: "Solitaire Ring",
  category: "Rings",
  material: "18k Gold",
  price: 1250,
  stock: 6,
  image: "/images/solitaire-ring.png",
};

// Helper function to render ProductCard
function renderProductCard(product = mockProduct) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

describe("ProductCard Component", () => {

  // Test 1: Display product name
  it("displays the product name", () => {
    renderProductCard();

    expect(screen.getByText("Solitaire Ring")).toBeTruthy();
  });

  // Test 2: Display product category
  it("displays the product category", () => {
    renderProductCard();

    expect(screen.getByText("Rings")).toBeTruthy();
  });

  // Test 3: Display product material
  it("displays the product material", () => {
    renderProductCard();

    expect(screen.getByText("Material: 18k Gold")).toBeTruthy();
  });

  // Test 4: Display product price
  it("displays the product price", () => {
    renderProductCard();

    expect(screen.getByText(/1,250/)).toBeTruthy();
  });

  // Test 5: Display product image with correct alt text
  it("displays the product image with the product name as alt text", () => {
    renderProductCard();

    const image = screen.getByAltText("Solitaire Ring");

    expect(image).toBeTruthy();
    expect(image.getAttribute("src")).toBe(
      "/images/solitaire-ring.png"
    );
  });

  // Test 6: Display available stock
  it("displays the available stock when stock is 5 or more", () => {
    renderProductCard();

    expect(screen.getByText("6 in stock")).toBeTruthy();
  });

  // Test 7: Display low stock warning
  it("displays Low stock when stock is below 5", () => {
    renderProductCard({
      ...mockProduct,
      stock: 3,
    });

    expect(screen.getByText("Low stock")).toBeTruthy();
  });

  // Test 8: Display Manage link
  it("displays a Manage link to the correct product details page", () => {
    renderProductCard();

    const manageLink = screen.getByRole("link", {
      name: "Manage",
    });

    expect(manageLink).toBeTruthy();
    expect(manageLink.getAttribute("href")).toBe("/products/1");
  });

  // Test 9: Check zero stock
  it("displays Low stock when product stock is zero", () => {
    renderProductCard({
      ...mockProduct,
      stock: 0,
    });

    expect(screen.getByText("Low stock")).toBeTruthy();
  });

  // Test 10: Check stock boundary
  it("does not display Low stock when stock is exactly 5", () => {
    renderProductCard({
      ...mockProduct,
      stock: 5,
    });

    expect(screen.getByText("5 in stock")).toBeTruthy();
  });
});