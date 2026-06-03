# Developer Portfolio Builder

A premium, production-grade client-side application designed to let developers build, customize, preview, and export professional portfolio websites in real time. It is built strictly as a client-side static web application conforming to the repository contribution guidelines.

---

## 🚀 Live Demo & Run Instructions
To run this application locally:
1. Double-click the [`index.html`](index.html) file inside your browser.
2. No servers, node build steps, or package managers are required.

---

## 🛠️ Tech Stack & Architecture
This project is built using 100% static, client-side technologies:
- **Core Engine**: Semantic HTML5 & Modern CSS3.
- **Styling Paradigm**: Responsive Flexbox/Grid layouts built around CSS Variables (Custom Properties) supporting system-wide themes.
- **Behavioral Logic**: Vanilla ES6 JavaScript for dynamic DOM updates, localStorage draft management, user state simulations, and single-file file packaging.
- **Typography & Icons**: Custom Google Fonts integration (Plus Jakarta Sans, Inter, Fira Code) and SVG-only responsive icons.

### Project Structure
```text
Projects/Developer Portfolio Builder/
├── index.html       # Dynamic split-pane dashboard workspace template
├── style.css        # Dashboard workspace design sheet & theme styles
├── script.js        # Auth session triggers, live preview compilers, & exporters
├── project.json     # Repository showcase integration schema
├── README.md        # Complete setup and features documentation
└── thumbnail.svg    # Visual logo card graphic
```

---

## ✨ Features & Functionalities

### 1. Mock Authentication & Session Router
- **Onboarding Flow**: Includes a dedicated Sign In & Sign Up tab panel.
- **Credentials Validation**: Validates passwords (minimum 6 characters) and prevents account email duplication.
- **Persistence**: User account listings are stored in the client-side `localStorage`. Active login sessions are maintained across page reloads.
- **Account Controls**: In the Settings panel, users can change their password or delete their account permanently.

### 2. Multi-Step Portfolio Form Builder
- **Personal Details**: Manage full name, professional title, and a multi-line short biography.
- **Social links**: Connect dynamic URL redirects for Email, GitHub, LinkedIn, and Twitter.
- **Skills Tag Manager**: Add comma-separated tags or press Enter to add skills tags dynamically. Individually delete tags instantly.
- **Work Experience & Projects**: Dynamically add, update, or delete nested items. Text inputs and descriptions automatically bind to the output model.

### 3. Profile Image Upload & Management
- **Image File Uploader**: Users can upload files directly via the custom `<input type="file">`. The system reads the image via HTML5 `FileReader` and converts it into a Base64 Data URL.
- **URL Fallback**: Alternatively, users can link an external image URL (e.g. GitHub avatar address).
- **Data Persistence**: The Base64 representation is saved to the draft and persists inside the preview frames automatically.

### 4. Style Customization & Theme Presets
- **Five Pre-designed Layouts**:
  1. *Minimalist*: Classic clean presentation with high contrast spacing.
  2. *Dark Modern*: Deep indigo/slate theme with rounded container cards.
  3. *Glassmorphism*: Semi-transparent frosted-glass containers layered over colorful background gradient glows.
  4. *Cyberpunk*: Monospaced font families with high contrast neon pink, cyan borders, and box shadows.
  5. *Neo-Brutalist*: Solid high-contrast block outlines, flat black shadows, and warm cream canvas backgrounds.
- **Accent Customizer**: Modify design highlight colors with the built-in Accent Color Picker.
- **Typography Selector**: Toggle base typography options (Inter, Plus Jakarta Sans, Fira Code, Georgia).

### 5. Workspace Theme Toggle
- The entire dashboard workspace supports instant Light Mode and Dark Mode toggling using CSS variables.

### 6. Standalone Export Systems
- **HTML Export**: Bundles the structured page elements and selected inline stylesheet configurations into a single standalone `.html` file.
- **PDF Export**: Triggers a print routing directed at the iframe rendering viewport. Includes `@media print` directives to guarantee that spacing, custom backgrounds, and colors match perfectly.
- **Word Document (.doc) Export**: Outputs a Word-compatible XML table layout document, preventing layout column shifts inside Microsoft Word.

---

## 📸 Screenshots & Usage Example
*An example mockup of the user workspace layout:*

```text
+--------------------------------------------------------+
|  DevFolio [PRO]          [Toggle Light/Dark]           |
+------------------+-------------------------------------+
|                  |                                     |
|  1. Overview     |          LIVE PORTFOLIO PREVIEW     |
|  2. Edit Form    |                                     |
|  3. Customize    |          +-----------------+        |
|  4. Settings     |          |   [Avatar image]|        |
|                  |          |   Jane Doe      |        |
|  [Active User]   |          |   Developer     |        |
|  Sign Out        |          +-----------------+        |
|                  |                                     |
+------------------+-------------------------------------+
| [Export HTML]       [Export PDF]         [Export Word] |
+--------------------------------------------------------+
```

---

## 🛡️ Contribution Guidelines
1. Ensure all styles and scripts remain fully self-contained within this folder.
2. Follow the project's spacing layout and standard 2-space indentation rule.
3. Test layout scaling on mobile, tablet, and desktop views inside the viewport toolbar.
