# Run the app
1 Download ngrok CLI & Install
2 Authenticate ngrok from your dashboard ->ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
3  Run vite server -> npm run dev
4 Run gnrok tunnel on vite port -> eg. ngrok http 5173
5 Copy HTTPS URL -> Forwarding https://...
6 Add it to Spotify dev dashboard as redirect URI
7 Update in spotify.js the const redirectUri = https://...


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
