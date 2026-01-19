# Bug Hunting Guide

## Systematic Bug Hunting

### Input Boundary Testing

Test values at and around boundaries:

| Boundary | Test Values |
|----------|-------------|
| Minimum | min, min-1, min+1 |
| Maximum | max, max-1, max+1 |
| Zero | 0, -1, 1 |
| Empty | "", [], {}, null, undefined |

```javascript
// For a function that accepts age 0-120
testCases = [
  { input: -1, expected: 'error' },
  { input: 0, expected: 'valid' },
  { input: 1, expected: 'valid' },
  { input: 119, expected: 'valid' },
  { input: 120, expected: 'valid' },
  { input: 121, expected: 'error' },
];
```

### State Transition Testing

Map out all possible states and transitions:

```
[Empty Cart] --add item--> [Cart with Items]
[Cart with Items] --remove all--> [Empty Cart]
[Cart with Items] --checkout--> [Checking Out]
[Checking Out] --payment success--> [Order Complete]
[Checking Out] --payment fail--> [Payment Error]
[Payment Error] --retry--> [Checking Out]
```

Test each transition, including:
- Invalid transitions (checkout from empty cart)
- Rapid transitions (double-click submit)
- Interrupted transitions (close browser mid-checkout)

### Race Condition Testing

Look for bugs when things happen simultaneously:

```javascript
// Test: What happens if user clicks "Buy" twice quickly?
test('prevents double purchase', async () => {
  const buyButton = screen.getByText('Buy');

  // Simulate rapid double-click
  fireEvent.click(buyButton);
  fireEvent.click(buyButton);

  // Should only create one order
  await waitFor(() => {
    expect(createOrder).toHaveBeenCalledTimes(1);
  });
});
```

Common race condition bugs:
- Double form submission
- Stale data after refresh
- Concurrent edits to same resource
- Timer/interval conflicts

### Error Path Testing

Force errors and verify handling:

```javascript
// Network errors
server.use(
  rest.get('/api/data', (req, res) => res.networkError('Failed'))
);

// Timeout
server.use(
  rest.get('/api/data', (req, res) => res.delay(30000))
);

// Server errors
server.use(
  rest.get('/api/data', (req, res, ctx) => res(ctx.status(500)))
);

// Malformed response
server.use(
  rest.get('/api/data', (req, res, ctx) => res(ctx.body('not json')))
);
```

### Permission Testing

Test with different user roles:

| Action | Admin | User | Guest |
|--------|-------|------|-------|
| View public data | ✓ | ✓ | ✓ |
| View own profile | ✓ | ✓ | ✗ |
| Edit own profile | ✓ | ✓ | ✗ |
| View others' data | ✓ | ✗ | ✗ |
| Delete any user | ✓ | ✗ | ✗ |

Also test:
- Accessing URLs directly (bypass navigation)
- Modifying IDs in requests
- Expired sessions
- Token tampering

## Where Bugs Hide

### Form Handling
- Submit with missing required fields
- Submit with spaces-only values
- Paste content with special characters
- Auto-fill behavior
- Back button after submit

### Lists and Tables
- Empty state (no items)
- Single item
- Many items (1000+)
- Sorting with special characters
- Filtering with no matches
- Pagination edge (last page with 1 item)

### Date/Time
- Timezone differences
- Daylight saving transitions
- Leap years (Feb 29)
- End of month (Jan 31 + 1 month = ?)
- Midnight edge cases

### Numbers and Currency
- Floating point precision (0.1 + 0.2)
- Negative amounts
- Very large numbers
- Currency formatting by locale
- Rounding behavior

### Async Operations
- Slow network responses
- Out-of-order responses
- Component unmount during fetch
- Multiple rapid requests
- Stale closures in callbacks

## Bug Reproduction Checklist

When you find a bug:

1. **Isolate** - What's the minimum to reproduce?
2. **Document** - Exact steps, environment, data
3. **Verify** - Reproduce 3 times to confirm
4. **Screenshot/Record** - Visual evidence
5. **Check logs** - Console errors, network, server logs
6. **Identify scope** - Where else might this occur?

## Exploratory Testing Sessions

Time-boxed exploration (30-60 min):

1. **Pick a focus area** (new feature, risky change)
2. **Set a charter** ("Explore payment flow looking for edge cases")
3. **Take notes** as you test
4. **Try to break it** creatively
5. **Log all findings** (bugs, questions, ideas)

Questions to ask:
- What if I do this twice?
- What if I do this really fast?
- What if I'm interrupted midway?
- What if my data is unusual?
- What if I use a different browser/device?
