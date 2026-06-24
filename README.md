# Brewed Awakenings — Coffee Shop Website

A warm, modern marketing website for **Brewed Awakenings**, a specialty coffee shop in Westlands, Nairobi. Built as a static, multi-page site with a simple client-side account system for visitors to sign up and log in.

## Features

- **Home page** — hero section, brand story teaser, "Today's Picks" signature drinks, customer testimonials, and a sign-up call-to-action.
- **Menu page** — full categorized menu (Espresso Classics, Signature Drinks, Cold & Iced, Tea & Others, Bites & Pastries) with pricing in KES.
- **About page** — the shop's origin story, team, and values.
- **Contact page** — location, hours, and a contact form.
- **Authentication** — client-side Sign Up / Login with form validation, a live password-strength meter, and persisted sessions, so the navbar greets returning visitors by name.
- **Responsive design** — collapsible hamburger navigation, scroll-reveal animations, and a navbar that adapts on scroll.

## Tech Stack

- **HTML5** — semantic, multi-page structure (no SPA framework or bundler)
- **CSS3** — custom design system with Google Fonts (Playfair Display + DM Sans)
- **Vanilla JavaScript (ES6+)** — no frameworks, no build step, no external JS dependencies
- **Browser storage** — `localStorage` for registered accounts and the active session

There is no backend server or database — the entire site runs in the browser.

## Project Structure

```
coffeeshop/
├── index.html             # Home page
├── css/
│   └── style.css           # All site styling
├── js/
│   ├── main.js              # Navbar, hamburger menu, scroll reveal, contact form UI
│   └── auth.js               # Sign up / login, session handling, nav auth state
├── pages/
│   ├── menu.html             # Menu
│   ├── about.html            # About / our story
│   ├── contact.html          # Contact form & location
│   ├── login.html            # Login form
│   └── register.html         # Registration form
└── LICENSE                  # Apache License 2.0
```

## Getting Started

No installation, build step, or server is required.

1. Download or clone this repository.
2. Open `index.html` directly in a modern browser (Chrome, Firefox, Edge, or Safari), **or** serve the folder with any static file server, for example:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
3. Browse the site, or create an account from the **Sign Up** page to try the login flow.

> Serving over `http://localhost` (rather than opening the file directly via `file://`) is recommended for the most consistent behavior across browsers.

## Data & Storage Notes

Account data is stored entirely in the browser via `localStorage`:

- Registered users (name, email, and a simple hashed password) are stored under a single key.
- The active login session is stored separately and read by every page to show the logged-in state in the navbar.

**Limitations to be aware of:**

- Data lives only in the current browser on the current device — it isn't synced across devices and is lost if site data is cleared.
- The password "hashing" used here is a simple, fast checksum for demo purposes — it is **not** a cryptographically secure hash (like bcrypt or Argon2) and should not be relied on to protect real user passwords.
- The contact form is a front-end simulation only; it doesn't actually send a message anywhere yet (no backend or email service is wired up).
- This is a front-end demo, not a production-ready system — for real customer accounts or orders, pair it with a proper backend, database, and secure authentication.

## Browser Support

Works in any modern evergreen browser (Chrome, Firefox, Edge, Safari) with `localStorage` support and JavaScript enabled.

## Roadmap Ideas

- Real backend for accounts, orders, and the contact form
- Online ordering / cart system
- CMS-driven menu so prices and items can be updated without editing code
- Loyalty program tracking tied to user accounts

## License

This project is licensed under the **Apache License, Version 2.0** — see the [LICENSE](./LICENSE) file for details.
