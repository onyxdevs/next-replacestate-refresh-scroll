# `router.refresh()` scrolls to top after `history.replaceState` changed the search params

Minimal reproduction for a Next.js App Router bug (present on 16.2.3, 16.3.4 and 16.4.0-canary.19).

```
npm install
npm run build && npm run start   # port 4612
npm run probe                    # Playwright: scroll to 800 → replaceState('?open=1') → router.refresh()
npm run probe -- --control       # same without the replaceState step (passes)
```

Manually: open http://localhost:4612, scroll down, click **1** (`history.replaceState('?open=1')` — the documented "native History API" pattern), then click **2** (`router.refresh()`). The page jumps to the top. Click **2** first on a fresh load and it does not.

The probe wraps the `scrollTop` setter and prints the caller of every write that moved the page: it is Next's `handlePotentialScroll` in `layout-router`, running from `componentDidUpdate` on the refresh commit.
