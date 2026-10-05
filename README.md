# Nexora Technologies: Portfolio Website

A premium company site built with plain HTML, CSS and JavaScript. No frameworks, no build step: open `index.html` in a browser.

## Structure
```
index.html   page markup (sections are filled in by script.js)
style.css    all styles; colors live in :root variables
script.js    data, storage, rendering, admin panel, animations
assets/      optional folder for your own images and icons
```
`script.js` is organized in numbered blocks: Configuration, Default Data, LocalStorage, Rendering, Projects, Services, Authentication, Admin Dashboard, Modals/Forms, Animations, Event Listeners.

## How it works
On load, `script.js` reads saved data from `localStorage` (or the defaults) and renders the logo, hero, about, stats, services, projects and footer. Every admin save calls `saveData()`, which stores the data and re-renders, so changes show on the public site immediately.

## Admin panel
Click **Admin** in the navigation and log in with `admin` / `1234`. The sidebar has Dashboard, Projects, Services, Website (info, logo, favicon, statistics), Social Links, Settings (Reset to Default Data, with confirmation) and Logout.

**Security note:** the login is a client-side demo. The credentials are in `script.js`, so anyone can read them. Do not use it to protect real data. Real protection needs a server.

## localStorage
All content is saved in the browser under the key `nexora_site_v3`. It is per browser and per device, so visitors on other devices see the defaults unless you edit the defaults in `script.js` (`makeDefaults`). Uploaded images are stored as data URLs inside localStorage, which has a limit of about 5 MB; uploads over 1.5 MB are refused. Prefer image URLs, or files placed in `assets/images/` and referenced by path (e.g. `assets/images/shop.jpg`).

## Customize
- **Admin credentials:** edit `AUTH` at the top of `script.js`.
- **Colors:** edit the `:root` variables in `style.css` (`--ac` is the accent).
- **Add a project manually:** add an object to `projects` in `makeDefaults()`:
```js
{ id: 5, title: 'My Site', description: '...', category: 'E-Commerce', image: 'assets/images/my-site.jpg', url: 'https://example.com', technologies: ['HTML','CSS','JavaScript'] }
```
Then use Reset to Default Data (or clear the `nexora_site_v3` key) to load the new defaults.

## Accessibility
Semantic HTML, labelled controls, visible focus, Escape closes dialogs, and `prefers-reduced-motion` disables animation.

## Arabic / RTL
The site is Arabic with `<html lang="ar" dir="rtl">`. All default content is in `makeDefaults()` in `script.js`; the Tajawal font loads from Google Fonts and falls back to system fonts offline.
