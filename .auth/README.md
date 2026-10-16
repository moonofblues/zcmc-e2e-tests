# .auth

Put `state.json` here. It is git-ignored because it contains credentials.

Create it from your normal browser:

1. Open https://sandbox-pr.zcmc.online (the app, with your saved sessions).
2. F12 -> Console, run:

```js
copy(JSON.stringify({
  cookies: [],
  origins: [{
    origin: location.origin,
    localStorage: Object.entries(localStorage)
      .filter(([k]) => !/^(tawk|twk|path$)/.test(k))
      .map(([name, value]) => ({ name, value })),
  }],
}))
```

3. Paste the clipboard into `e2e/.auth/state.json` and save.

Re-do this whenever you add or change users in the User Switcher.
