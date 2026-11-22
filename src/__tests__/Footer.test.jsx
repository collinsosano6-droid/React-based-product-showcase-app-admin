import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import Footer from "../components/Footer";

// The store data we give the Footer (like what the server sends)
const store = {
  name: "Merc Jewelry",
  tagline: "Handcrafted jewelry for every occasion",
  phone_number: "123-456-789",
  email: "info@merc.example",
  address: "12 Market Avenue, Nairobi",
  hours: "Mon-Fri, 9:00-18:00",
};

// Helper: draws the Footer on a fake page
function renderFooter() {
  render(
    <MemoryRouter>
      <Footer store={store} loading={false} error={null} />
    </MemoryRouter>
  );
}

// Test 1: the phone number is a link that starts a call
test("phone link uses tel:", () => {
  renderFooter();
  const phoneLink = screen.getByRole("link", { name: "123-456-789" });
  expect(phoneLink).toHaveAttribute("href", "tel:123-456-789");
});

// Test 2: the email is a link that opens an email
test("email link uses mailto:", () => {
  renderFooter();
  const emailLink = screen.getByRole("link", { name: "info@merc.example" });
  expect(emailLink).toHaveAttribute("href", "mailto:info@merc.example");
});

// Test 3: the address is shown as plain text
test("shows the store address", () => {
  renderFooter();
  expect(screen.getByText("12 Market Avenue, Nairobi")).toBeInTheDocument();
});