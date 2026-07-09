# Walkthrough of Folio Updates & Token Handling

I have completed the full-stack system upgrades for the **Folio** portfolio builder platform. Below is a detailed summary of the architectural changes, UI/UX refinements, and verification tests performed.

## Changes Made

### 1. Token Expiration Hardening & Refactoring
- **Backend Filter Catch (`JwtAuthFilter.java`)**: Added an explicit catch block for `io.jsonwebtoken.ExpiredJwtException` inside `doFilterInternal`. When an expired JWT is detected, it responds with an HTTP `401 Unauthorized` status and writes `"Token Expired"` cleanly to the response body, instead of logging a massive stack trace.
- **Frontend Interceptor Catch (`axiosConfig.js`)**: The response interceptor catches the `401 Unauthorized` status returned by the backend, automatically clears the expired token and session headers from local storage, and redirects the user back to the `/login` route.

### 2. SECTION 1: Visual Retrofitting & UI Overhaul
- **Two-Column asymmetric Hero Split Layout (`PublicPortfolio.jsx`)**:
  - **Left Column**: Displays "Hello, I'm" in bold white. Below it, the owner's name is set to a highly responsive and controlled scale (`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-2`) and styled with the Amethyst-to-Cyan gradient (`from-[#a78bfa] via-[#c084fc] to-[#22d3ee]`).
  - **Animated Typewriter**: Cycles through the user's defined roles (`profile.roles` split by comma) matching cyan (`text-[#22d3ee] font-mono`), trailing with a flashing vertical pipe cursor (`|`).
  - **Bio Summary Relocation**: Completely removed the bio summary paragraph (`profile.bio`) from the Hero/Home layout entirely to ensure the space under the typewriter dynamic component remains clean. The bio is now exclusively rendered inside the dedicated `About Me` section.
  - **Right Column (Interactive Graphic Card with 3D Orbiting Mesh)**:
    - **Layer 1 (Neon Backing Aura)**: Pulsing glow element absolute behind the card: `absolute -inset-4 bg-gradient-to-tr from-[#c084fc]/20 to-[#22d3ee]/20 blur-3xl rounded-2xl -z-10 animate-pulse`.
    - **Layer 2 (3D Orbiting Mesh Rings)**: Nested rings rotated in 3D:
      - Ring 1 (Clockwise): `absolute -inset-6 border border-dashed border-[#22d3ee]/30 rounded-xl pointer-events-none animate-[spin_25s_linear_infinite] [transform:rotateX(45deg)_rotateY(15deg)]`
      - Ring 2 (Counter-Clockwise): `absolute -inset-10 border border-dotted border-[#c084fc]/20 rounded-xl pointer-events-none animate-[spin_35s_linear_infinite_reverse] [transform:rotateX(-30deg)_rotateY(-20deg)]`
    - **Layer 3 (Constellation Nodes)**: Three glowing blue dots absolute positioned along boundaries (`w-1.5 h-1.5 rounded-full bg-[#22d3ee] absolute shadow-[0_0_8px_#22d3ee] animate-bounce`) providing a volumetric floating sci-fi appearance.
    - **Asset Pipeline Resolver**: Established a custom `getImageUrl` helper that checks if a file is already absolute (HTTP) or dynamically streams from the Spring Boot download route (`http://localhost:8080/api/files/download/...`), falling back to uppercase initials when no avatar is uploaded.
- **Asymmetric Contact Grid Transformation (`PublicPortfolio.jsx`)**:
  - Split into a `40% : 60%` horizontal ratio:
  - **Card 1: Get In Touch (40% Width)**: Translucent glass containing SVGs for Email (`mailto:`) and Phone (`tel:`) styled as blue and indigo containers.
  - **Card 2: Send a Message (60% Width)**: Features dark inputs (`bg-[#0c101f] border border-slate-900 focus:border-purple-500/50 text-white rounded-lg p-4 transition-all outline-none w-full`) and a cobalt-to-indigo button (`bg-gradient-to-r from-[#5046e5] to-[#6366f1] text-white font-semibold text-base py-4 rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:brightness-110 active:scale-[0.99] transition-all duration-200`).

### 3. SECTION 2: Extending the Chat Builder & Database Schema
- **Database Enhancements (`profiles` table)**:
  - Added `font_family` column to store typography selections.
  - Mapped `fontFamily` in the `Profile` entity, `ProfileDTO` record, and `ProfileService` conversion flows.
- **Dual-Slot Media Uploader (`PortfolioChatBuilder.jsx`)**:
  - Extended Step 5 to render a split uploader.
  - **Slot A**: PDF Resume file collector.
  - **Slot B**: Profile Avatar file collector (.png, .jpg, .jpeg, < 5MB) with instant local preview capabilities.
- **Design Engine - Font Picker Integration (`PortfolioChatBuilder.jsx` & `PublicPortfolio.jsx`)**:
  - In the Step 8 final review, added a visual font dropdown mapping Inter / Sans (`sans`), Playfair Display / Serif (`serif`), and Fira Code / Mono (`mono`) typographic scales.
  - Added Google Fonts imports for Inter, Playfair Display, and Fira Code to `index.css`.
  - Wrapped `PublicPortfolio.jsx` in the resolved typography scale class dynamically.

### 4. SECTION 3: One-Click Production Deployment Orchestration
- **Deployment Panel & Success Modal (`PortfolioChatBuilder.jsx`)**:
  - Renders a celebrative deployment modal after a successful save action.
  - Shows the immutable live production URL path.
  - Includes a "Copy to Clipboard" utility with tooltip feedback ("Copied!").
  - Includes a green "Launch Live Site ↗" button opening the generated path in a fresh window.
- **Production Hardening (`CorsConfig.java` & `SecurityConfig.java`)**:
  - Added a `@Value("${app.frontend.url}")` property to dynamically load allowed CORS origins and Google OAuth2 success redirection URLs, preventing container recycle errors.

---

## Verification & Build Results
- **Backend Recompilation (`mvn compile`)**: Success (no compilation warnings/errors).
- **Spring Boot Bootstrap**: Started successfully in 7.9 seconds listening on port 8080.
- **Frontend Production Bundling (`npm run build`)**: Bundled successfully in 1.25 seconds.

### 5. Hotfixes & Refinements
- **Hero Typography Tuning (`PublicPortfolio.jsx`)**: Aligned the name header layout and font size with the landing page design, adding the uppercase monospace `Hello, I'm` prefix label, setting the size to `text-4xl sm:text-5xl lg:text-6xl`, and changing the background clip text gradient to the signature `from-indigo-400 via-purple-400 to-cyan-400` theme.
- **Edit Mode Restoration (`PortfolioChatBuilder.jsx`)**: Changed the initialization step on edit mode to `10` (the summary/review editor), preventing the editor from opening on Step 8 (Achievements step). Added fallback empty arrays (`|| []`) to all profile fields so editing loads reliably.
- **Achievements Activation**: Successfully terminated the stale backend instance on port `8080` (PID 8424) and booted a new process. This triggered the JPA Hibernate schema update to automatically create the `achievements` table and updated column details in PostgreSQL, allowing creations and edits to register correctly.
- **Mockup-Based Overhauls (`PublicPortfolio.jsx`)**:
  - **Certifications section**: Redesigned to feature the green uppercase `/ Credentials` tag header, a 4-column cards grid layout containing a square badge container with a green ribbon medal icon, title bold text, and a monospace organization label prefix.
  - **Achievements section**: Overhauled with the green uppercase `/ Recognition` tag header, gradient horizontal underline indicator, 2-column cards grid layout with tag labels ("Major Achievement" or "Selected Cohort"), and right-aligned recognition date badges alongside proof images.
  - **Volumetric Card section**: Replaced the outer scanner layout with a dark teal-green glassmorphic outer container, a nested inner card with watermarked last name, profile title, and saturated profile image, and a floating bottom glass pill bar showing the user's @slug, 'Open to Work' status, and a 'Hire Me' button linking to the contact form.



