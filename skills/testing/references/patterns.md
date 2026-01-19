# Testing Patterns

## Unit Test Patterns

### Arrange-Act-Assert
```javascript
test('calculateTotal applies discount correctly', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 50 }];
  const discount = 0.1;

  // Act
  const total = calculateTotal(items, discount);

  // Assert
  expect(total).toBe(135); // 150 - 10%
});
```

### Test Isolation
```javascript
// Each test should be independent
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
  localStorage.clear();
});
```

### Testing Error Cases
```javascript
test('throws on invalid input', () => {
  expect(() => processData(null)).toThrow('Data required');
  expect(() => processData({})).toThrow('Invalid format');
});

test('async function rejects with error', async () => {
  await expect(fetchUser('invalid-id')).rejects.toThrow('User not found');
});
```

### Parameterized Tests
```javascript
test.each([
  [0, 'zero'],
  [1, 'one'],
  [-1, 'negative one'],
  [1000000, 'one million'],
])('formatNumber(%i) returns %s', (input, expected) => {
  expect(formatNumber(input)).toBe(expected);
});
```

## Integration Test Patterns

### API Testing
```javascript
describe('POST /api/users', () => {
  test('creates user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      name: 'Test',
    });
  });

  test('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid', name: 'Test' })
      .expect(400);

    expect(response.body.error).toContain('email');
  });
});
```

### Database Testing
```javascript
describe('UserRepository', () => {
  beforeEach(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  test('finds user by email', async () => {
    const user = await userRepo.findByEmail('existing@example.com');
    expect(user).toBeDefined();
    expect(user.name).toBe('Existing User');
  });
});
```

## React Component Testing

### Testing User Interactions
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('form submits with valid data', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  // Fill form
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' },
  });

  // Submit
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  // Verify
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### Testing Async Behavior
```javascript
import { render, screen, waitFor } from '@testing-library/react';

test('displays data after loading', async () => {
  render(<UserProfile userId="123" />);

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // Loading gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

### Testing Error States
```javascript
test('displays error when fetch fails', async () => {
  // Mock API failure
  server.use(
    rest.get('/api/user/:id', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<UserProfile userId="123" />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load user')).toBeInTheDocument();
  });
});
```

## E2E Test Patterns

### Page Object Model
```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.js
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Testing Critical Flows
```javascript
test('complete checkout flow', async ({ page }) => {
  // Add item to cart
  await page.goto('/products/1');
  await page.click('button:text("Add to Cart")');

  // Go to checkout
  await page.click('a:text("Cart")');
  await page.click('button:text("Checkout")');

  // Fill shipping
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="city"]', 'New York');
  await page.click('button:text("Continue")');

  // Payment
  await page.fill('[name="card"]', '4242424242424242');
  await page.click('button:text("Pay")');

  // Confirmation
  await expect(page.locator('.order-confirmation')).toBeVisible();
  await expect(page.locator('.order-number')).toHaveText(/ORD-\d+/);
});
```

## Mock Patterns

### Mocking API Calls
```javascript
// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('handles API response', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  });

  const result = await fetchData();
  expect(result).toEqual({ data: 'test' });
});
```

### Mocking Time
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-15'));
});

afterEach(() => {
  jest.useRealTimers();
});

test('shows correct relative time', () => {
  const date = new Date('2024-01-14');
  expect(formatRelativeTime(date)).toBe('1 day ago');
});
```
