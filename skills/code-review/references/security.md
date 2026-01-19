# Security Review Guide

## Injection Vulnerabilities

### SQL Injection
```javascript
// BAD - vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD - parameterized
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);
```

### NoSQL Injection
```javascript
// BAD - user can pass { $gt: "" } to bypass
const user = await User.findOne({ email: req.body.email });

// GOOD - validate type
if (typeof req.body.email !== 'string') throw new Error('Invalid email');
```

### XSS (Cross-Site Scripting)
```javascript
// BAD - direct HTML insertion
element.innerHTML = userInput;

// GOOD - text content or sanitize
element.textContent = userInput;
// or use DOMPurify for HTML
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Command Injection
```javascript
// BAD
exec(`convert ${filename} output.png`);

// GOOD - use array form
execFile('convert', [filename, 'output.png']);
```

## Authentication & Authorization

### Check Every Protected Route
```javascript
// Middleware should verify:
// 1. Token/session is valid
// 2. User has permission for this resource
// 3. User owns the data they're accessing

// BAD - only checks auth, not ownership
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order); // Anyone can see any order!
});

// GOOD - verify ownership
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id  // Must belong to user
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});
```

## Secrets Management

### Never Hardcode
```javascript
// BAD
const stripe = new Stripe('sk_live_abc123...');

// GOOD
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

### Never Log Sensitive Data
```javascript
// BAD
console.log('User login:', { email, password });
console.log('Payment:', paymentDetails);

// GOOD
console.log('User login:', { email });
console.log('Payment processed:', { orderId, amount });
```

### Check for Exposed Secrets
- `.env` files not in `.gitignore`
- API keys in client-side code
- Credentials in error messages
- Tokens in URLs (use headers instead)

## Data Validation

### Validate All Input
```javascript
// Use a validation library
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
  role: z.enum(['user', 'admin'])
});

// Validate before using
const validatedData = userSchema.parse(req.body);
```

### Sanitize Before Storage
- Strip HTML from text fields
- Normalize emails (lowercase, trim)
- Validate file types by content, not extension

## Rate Limiting

```javascript
// Protect against brute force
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, loginHandler);
```
