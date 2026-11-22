import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import ProductDetail from "../pages/ProductDetail";

const product = {
  id: 1,
  name: "Solitaire Ring",
  description: "Classic round-cut stone with a slim band",
  category: "Rings",
  material: "18k Gold",
  price: 1250,
  stock: 6,
  image: "",
};

// Draws the page at a route, like the real app does
function renderPage(path = "/products/1") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<p>Product list page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

// A fake server: answers GET, PATCH and DELETE without the real server
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options) => {
      if (options?.method === "PATCH") {
        return { ok: true, json: async () => ({ ...product, ...JSON.parse(options.body) }) };
      }
      if (options?.method === "DELETE") {
        return { ok: true, json: async () => ({}) };
      }
      if (String(url).endsWith("/products/999")) {
        return { ok: false, json: async () => ({}) };
      }
      return { ok: true, json: async () => product };
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Test 1: the form is pre-filled with the product
test("shows the product values in the form", async () => {
  renderPage();
  expect(await screen.findByLabelText("Name")).toHaveValue("Solitaire Ring");
  expect(screen.getByLabelText("Price (USD)")).toHaveValue("1250");
  expect(screen.getByLabelText("Stock")).toHaveValue("6");
});

// Test 2: an unknown id shows the not-found page
test("shows a not-found message for an unknown id", async () => {
  renderPage("/products/999");
  expect(await screen.findByRole("heading", { name: "Product not found" })).toBeInTheDocument();
});


test("shows loading state while fetching the product", async () => {
  fetch.mockImplementation(
    () => new Promise(() => {})
  );

  renderPage();

  expect(screen.getByText("Loading product..."))
    .toBeInTheDocument();
});

// Test 3: a bad price shows an error and nothing is sent
test("shows an error and does not save when the price is invalid", async () => {
  renderPage();
  const price = await screen.findByLabelText("Price (USD)");
  await userEvent.clear(price);
  await userEvent.type(price, "-5");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(/price must be/i);
  const patchCalls = fetch.mock.calls.filter(([, options]) => options?.method === "PATCH");
  expect(patchCalls).toHaveLength(0);
});

// Test 4: saving sends a PATCH with the new price
test("saving sends a PATCH with the new price", async () => {
  renderPage();
  const price = await screen.findByLabelText("Price (USD)");
  await userEvent.clear(price);
  await userEvent.type(price, "1300");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByRole("status")).toHaveTextContent("Changes saved.");
  const patchCall = fetch.mock.calls.find(([, options]) => options?.method === "PATCH");
  expect(patchCall[0]).toContain("/products/1");
  expect(JSON.parse(patchCall[1].body).price).toBe(1300);
});


test("saving sends all seven updated product fields", async () => {
  renderPage();

  await userEvent.clear(await screen.findByLabelText("Name"));
  await userEvent.type(screen.getByLabelText("Name"), "Diamond Ring");

  await userEvent.clear(screen.getByLabelText("Description"));
  await userEvent.type(
    screen.getByLabelText("Description"),
    "Premium diamond ring"
  );

  await userEvent.selectOptions(
    screen.getByLabelText("Category"),
    "Necklaces"
  );

  await userEvent.clear(screen.getByLabelText("Material"));
  await userEvent.type(screen.getByLabelText("Material"), "Platinum");

  await userEvent.clear(screen.getByLabelText("Price (USD)"));
  await userEvent.type(screen.getByLabelText("Price (USD)"), "2500");

  await userEvent.clear(screen.getByLabelText("Stock"));
  await userEvent.type(screen.getByLabelText("Stock"), "10");

  await userEvent.clear(screen.getByLabelText("Image URL"));
  await userEvent.type(
    screen.getByLabelText("Image URL"),
    "https://example.com/ring.jpg"
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Save changes" })
  );

  expect(await screen.findByRole("status"))
    .toHaveTextContent("Changes saved.");

  const patchCall = fetch.mock.calls.find(
    ([, options]) => options?.method === "PATCH"
  );

  const body = JSON.parse(patchCall[1].body);

  expect(body).toEqual({
    name: "Diamond Ring",
    description: "Premium diamond ring",
    category: "Necklaces",
    material: "Platinum",
    price: 2500,
    stock: 10,
    image: "https://example.com/ring.jpg",
  });

  expect(screen.getByLabelText("Name"))
    .toHaveValue("Diamond Ring");
});


test("shows an error when PATCH fails", async () => {
  fetch.mockImplementation(async (url, options) => {
    if (options?.method === "PATCH") {
      return {
        ok: false,
        json: async () => ({}),
      };
    }

    return {
      ok: true,
      json: async () => product,
    };
  });

  renderPage();

  const price = await screen.findByLabelText("Price (USD)");

  await userEvent.clear(price);
  await userEvent.type(price, "1500");

  await userEvent.click(
    screen.getByRole("button", { name: "Save changes" })
  );

  expect(await screen.findByRole("alert"))
    .toHaveTextContent(
      "Could not save the changes. Please try again."
    );
});

// Test 5: cancelling the confirmation deletes nothing
test("cancelling the delete confirmation does not delete", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(false);
  renderPage();
  await userEvent.click(await screen.findByRole("button", { name: "Delete product" }));

  const deleteCalls = fetch.mock.calls.filter(([, options]) => options?.method === "DELETE");
  expect(deleteCalls).toHaveLength(0);
});

// Test 6: confirming sends DELETE and goes back to the list
test("confirming the delete sends DELETE and goes back to the list", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  renderPage();
  await userEvent.click(await screen.findByRole("button", { name: "Delete product" }));

  expect(await screen.findByText("Product list page")).toBeInTheDocument();
  const deleteCall = fetch.mock.calls.find(([, options]) => options?.method === "DELETE");
  expect(deleteCall[0]).toContain("/products/1");
});
