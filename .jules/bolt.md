## 2024-05-23 - Client-Side Fetch Waterfalls
**Learning:** Sequential `await` calls in client-side `useEffect` hooks create unnecessary waterfalls, delaying content rendering or redirects.
**Action:** Identify independent async operations and parallelize them using `Promise.all` or by initiating promises before awaiting them. In this case, parallelizing `setup` status check (DB) and `session` check (CPU/Cookie) reduces initial load time by hiding the latency of the faster request.
