import { vi, beforeEach, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddProduct from '../pages/AddProduct';

// Mock the router's navigate function
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock fetch before each test
beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 13, name: 'Test Ring' }),
    })
  );
});

// Helper: type a value into a field found by its label
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label), {
    target: { value },
  });
}

// Test 1: shows the heading
test('renders the Add Product heading', () => {
  render(<AddProduct />);
  expect(
    screen.getByRole('heading', { name: 'Add Product' })
  ).toBeInTheDocument();
});

// Test 2: shows every field
test('renders all form fields', () => {
  render(<AddProduct />);

  ['Name', 'Description', 'Category', 'Material', 'Price', 'Stock', 'Image'].forEach(
    (label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  );
});

// Test 3: category dropdown includes Watches and Cufflinks
test('category dropdown has all categories', () => {
  render(<AddProduct />);

  expect(screen.getByRole('option', { name: 'Watches' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Cufflinks' })).toBeInTheDocument();
});

// Test 4: typing updates the input
test('typing updates the name field', () => {
  render(<AddProduct />);

  fill('Name', 'Test Ring');

  expect(screen.getByLabelText('Name')).toHaveValue('Test Ring');
});

// Test 5: submitting sends a POST with numbers for price and stock
test('submits the new product with POST', async () => {
  render(<AddProduct />);

  fill('Name', 'Test Ring');
  fill('Description', 'A test ring');
  fill('Category', 'Rings');
  fill('Material', 'Silver');
  fill('Price', '500');
  fill('Stock', '3');
  fill('Image', '/images/test-ring.png');

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  const [url, options] = fetch.mock.calls[0];

  expect(url).toContain('/products');
  expect(options.method).toBe('POST');

  expect(JSON.parse(options.body)).toEqual({
    name: 'Test Ring',
    description: 'A test ring',
    category: 'Rings',
    material: 'Silver',
    price: 500,
    stock: 3,
    image: '/images/test-ring.png',
  });
});

// Test 6: calls onAdd and redirects after submit
test('calls onAdd and redirects to /products after submit', async () => {
  const onAdd = vi.fn();

  render(<AddProduct onAdd={onAdd} />);

  fill('Name', 'Test Ring');
  fill('Description', 'A test ring');
  fill('Category', 'Rings');
  fill('Price', '500');
  fill('Stock', '3');

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  await waitFor(() => {
    expect(onAdd).toHaveBeenCalledWith({ id: 13, name: 'Test Ring' });
  });

  expect(mockNavigate).toHaveBeenCalledWith('/products');
});

// Test 7: required fields show errors and do not call fetch
test('empty form shows required errors and does not call fetch', () => {
  render(<AddProduct />);

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  expect(screen.getByText('Name is required')).toBeInTheDocument();
  expect(screen.getByText('Description is required')).toBeInTheDocument();
  expect(screen.getByText('Category is required')).toBeInTheDocument();
  expect(screen.getByText('Price is required')).toBeInTheDocument();
  expect(screen.getByText('Stock is required')).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});

// Test 8: invalid price is rejected
test('rejects a price of 0 or less', () => {
  render(<AddProduct />);

  fill('Name', 'Test Ring');
  fill('Description', 'A test ring');
  fill('Category', 'Rings');
  fill('Price', '-5');
  fill('Stock', '3');

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  expect(
    screen.getByText('Price must be a number greater than 0')
  ).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});

// Test 9: invalid stock is rejected
test('rejects a stock that is negative or not a whole number', () => {
  render(<AddProduct />);

  fill('Name', 'Test Ring');
  fill('Description', 'A test ring');
  fill('Category', 'Rings');
  fill('Price', '500');
  fill('Stock', '2.5');

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  expect(
    screen.getByText('Stock must be a whole number, 0 or more')
  ).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});

// Test 10: a failed POST shows an error and keeps the typed values
test('failed POST shows an error and keeps the typed values', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch = vi.fn(() => Promise.resolve({ ok: false }));

  render(<AddProduct />);

  fill('Name', 'Test Ring');
  fill('Description', 'A test ring');
  fill('Category', 'Rings');
  fill('Price', '500');
  fill('Stock', '3');

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));

  expect(
    await screen.findByText('Could not add the product. Please try again.')
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Name')).toHaveValue('Test Ring');
  expect(mockNavigate).not.toHaveBeenCalled();
});