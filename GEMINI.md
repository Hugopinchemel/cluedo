# Gemini Foundational Mandates - Cluedo (Windows OS Simulation)

This project is a web-based simulation of a Windows 10/11-like operating system interface built with **Nuxt 4**, **Vue 3**, and **SCSS**.

## Technical Stack & Architecture
- **Framework:** Nuxt 4 (using `nuxt` ^4.4.2).
- **Frontend:** Vue 3 Composition API with `<script setup lang="ts">`.
- **Styling:** SCSS (Sass) for all styles. Prefer component-scoped styles or global SCSS in `app/assets/css/main.scss`.
- **State Management:** Custom composables (e.g., `app/composables/useWindows.ts`) using standard Vue `ref`/`computed`.
- **Components:** 
  - `app/components/win/`: Core OS interface components (Taskbar, StartMenu, Window frame, etc.).
  - `app/components/apps/`: Individual application implementations (Notepad, Calculator, etc.).

## Development Standards
- **Strict Typing:** Always use TypeScript. Define interfaces for state and props.
- **Window Management:** All window operations (opening, closing, focusing, moving) MUST go through the `useWindows` composable.
- **Z-Index:** Manage layering through the `zIndex` property in `WinInstance`.
- **Responsiveness:** Focus on a desktop-first experience that mimics a native OS environment.
- **Nuxt Conventions:** Follow the standard Nuxt 3/4 directory structure. Note that the application source is located in the `app/` directory.

## UI/UX Guidelines
- **Aesthetic:** Aim for a "Fluent Design" or "Windows 10/11" look and feel.
- **Icons:** Use emojis or the `windows-ui-fabric` library if applicable.
- **Interactivity:** Support dragging (Window movement), resizing (future), and taskbar integration.
- **Context Menus:** Use `ContextMenu.vue` for all right-click operations.

## Testing & Validation
- Ensure all new components are tested for basic rendering and state changes.
- Verify that opening/closing apps doesn't leak state or cause z-index collisions.
