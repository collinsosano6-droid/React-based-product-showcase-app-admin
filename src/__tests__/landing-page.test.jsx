
import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/Home";
import useFetch from "../hooks/useFetch";

// Mock the useFetch hook
vi.mock("../hooks/useFetch", () => ({
  default: vi.fn(),
}));

// Store information passed to Home through props
const mockStore = {
  id: 1,
  name: "Merc Jewelry",
  tagline: "Jewelry for every occasion",
  description:
    "An independent jewelry house offering rings, necklaces, earrings and bracelets.",
};

// Six sample products
const mockProducts = [
  {
    id: 1,
    name: "Solitaire Ring",
    category: "Rings",
    material: "18k Gold",
    price: 1250,
    image: "ring.jpg",
  },
  {
    id: 9,
    name: "Classic Leather Watch",
    category: "Watches",
    material: "Stainless Steel",
    price: 380,
    image: "watch.jpg",
  },
  {
    id: 5,
    name: "Pearl Drop Earrings",
    category: "Earrings",
    material: "Sterling Silver",
    price: 180,
    image: "earrings.jpg",
  },
  {
    id: 11,
    name: "Onyx Square Cufflinks",
    category: "Cufflinks",
    material: "Sterling Silver",
    price: 120,
    image: "cufflinks.jpg",
  },
  {
    id: 3,
    name: "Infinity Necklace",
    category: "Necklaces",
    material: "Rose Gold",
    price: 420,
    image: "necklace.jpg",
  },
  {
    id: 7,
    name: "Tennis Bracelet",
    category: "Bracelets",
    material: "Platinum",
    price: 2100,
    image: "bracelet.jpg",
  },
];

// Configure the mocked products request
useFetch.mockReturnValue({
  data: mockProducts,
  loading: false,
  error: null,
});

// Helper function to render the landing page
function renderLandingPage() {
  return render(
    <MemoryRouter>
      <LandingPage
        store={mockStore}
        loading={false}
        error={null}
      />
    </MemoryRouter>
  );
}

describe("LandingPage", () => {
  it("renders the landing page correctly", () => {
    renderLandingPage();
  });

  it("displays the store name", () => {
    renderLandingPage();

    expect(screen.getByText("Merc Jewelry")).toBeInTheDocument();
  });

  it("displays the store tagline", () => {
    renderLandingPage();

    expect(
      screen.getByText("Jewelry for every occasion")
    ).toBeInTheDocument();
  });

  it("displays the store description", () => {
    renderLandingPage();

    expect(
      screen.getByText(/An independent jewelry house offering rings/)
    ).toBeInTheDocument();
  });

  it("displays the hero heading", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        name: "Elegance in Every Detail.",
      })
    ).toBeInTheDocument();
  });

  it("displays the Browse Products link", () => {
    renderLandingPage();

    expect(
      screen.getByRole("link", { name: /browse products/i })
    ).toBeInTheDocument();
  });

  it("displays the Add Products link", () => {
    renderLandingPage();

    expect(
      screen.getByRole("link", { name: /add products/i })
    ).toBeInTheDocument();
  });

  it("displays the Shop by Category section", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", { name: /shop by category/i })
    ).toBeInTheDocument();
  });

  it("displays the first six products", () => {
    renderLandingPage();

    expect(screen.getByText("Solitaire Ring")).toBeInTheDocument();
    expect(screen.getByText("Classic Leather Watch")).toBeInTheDocument();
    expect(screen.getByText("Pearl Drop Earrings")).toBeInTheDocument();
    expect(screen.getByText("Onyx Square Cufflinks")).toBeInTheDocument();
    expect(screen.getByText("Infinity Necklace")).toBeInTheDocument();
    expect(screen.getByText("Tennis Bracelet")).toBeInTheDocument();
  });

  it("displays product images with alt text", () => {
    renderLandingPage();

    const images = screen.getAllByRole("img");

    expect(images.length).toBeGreaterThanOrEqual(6);

    images.forEach((image) => {
      expect(image).toHaveAttribute("alt");
    });
  });
});
