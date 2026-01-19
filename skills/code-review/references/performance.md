# Performance Review Guide

## Database Performance

### N+1 Queries
```javascript
// BAD - N+1 problem (1 query + N queries)
const posts = await Post.find();
for (const post of posts) {
  post.author = await User.findById(post.authorId); // Query per post!
}

// GOOD - eager loading
const posts = await Post.find().populate('author');

// GOOD - batch query
const posts = await Post.find();
const authorIds = [...new Set(posts.map(p => p.authorId))];
const authors = await User.find({ _id: { $in: authorIds } });
const authorMap = new Map(authors.map(a => [a.id, a]));
posts.forEach(p => p.author = authorMap.get(p.authorId));
```

### Missing Indexes
```javascript
// If you query by a field frequently, it needs an index
// Check with explain()
const result = await collection.find({ email }).explain('executionStats');
// Look for: COLLSCAN (bad) vs IXSCAN (good)

// Add index
db.users.createIndex({ email: 1 });
```

### Unbounded Queries
```javascript
// BAD - could return millions of records
const allUsers = await User.find();

// GOOD - always paginate
const users = await User.find()
  .skip(page * pageSize)
  .limit(pageSize);
```

## Frontend Performance

### Unnecessary Re-renders (React)
```javascript
// BAD - new object every render causes child re-render
function Parent() {
  return <Child style={{ color: 'red' }} />;
}

// GOOD - stable reference
const style = { color: 'red' };
function Parent() {
  return <Child style={style} />;
}

// GOOD - memoize if computed
const style = useMemo(() => ({ color: theme.primary }), [theme.primary]);
```

### Missing Memoization
```javascript
// BAD - expensive calculation every render
function Component({ items }) {
  const sorted = items.sort((a, b) => a.price - b.price); // Runs every render!
  return <List items={sorted} />;
}

// GOOD - memoize expensive operations
function Component({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.price - b.price),
    [items]
  );
  return <List items={sorted} />;
}
```

### Memory Leaks
```javascript
// BAD - no cleanup
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  window.addEventListener('resize', handleResize);
  // Missing cleanup!
}, []);

// GOOD - cleanup on unmount
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  window.addEventListener('resize', handleResize);

  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### Large Lists
```javascript
// BAD - render 10,000 items
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>

// GOOD - virtualize large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={items.length}
  itemSize={35}
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

## API Performance

### Missing Caching
```javascript
// Add cache headers for static/slow-changing data
res.set('Cache-Control', 'public, max-age=3600'); // 1 hour

// Use Redis/memory cache for computed data
const cached = await redis.get(`user:${id}:stats`);
if (cached) return JSON.parse(cached);

const stats = await computeExpensiveStats(id);
await redis.set(`user:${id}:stats`, JSON.stringify(stats), 'EX', 3600);
return stats;
```

### Unnecessary Data
```javascript
// BAD - returns everything
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users); // Includes passwords, internal fields!
});

// GOOD - select only needed fields
app.get('/api/users', async (req, res) => {
  const users = await User.find().select('id name email avatar');
  res.json(users);
});
```

### Missing Compression
```javascript
import compression from 'compression';
app.use(compression()); // Gzip responses
```

## Bundle Size

### Check for Large Dependencies
```bash
# Analyze bundle
npx webpack-bundle-analyzer

# Check package size before installing
npx bundlephobia <package-name>
```

### Tree Shaking
```javascript
// BAD - imports entire library
import _ from 'lodash';
_.map(items, fn);

// GOOD - import only what you need
import map from 'lodash/map';
map(items, fn);
```

### Dynamic Imports
```javascript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```
