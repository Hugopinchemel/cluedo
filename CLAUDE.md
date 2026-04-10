# CLAUDE.md - Project Overview & Work Log

## Project: Cluedo (Windows OS Simulation)
A web-based simulation of a Windows 10/11 environment built with Nuxt 4 and Vue 3.

## Recent Work (April 10, 2026)

### Notifications & UI Refinement
I have overhauled the notification system to align with the project's goal of a realistic Windows OS simulation.

#### Changes:
1.  **Windows 10/11 Notification Style**:
    *   Toast notifications (pop-ups) now use an Acrylic-style background (translucent with blur).
    *   Layout updated: Header (App icon + Name + Close) and Content (Title + Body).
2.  **Notification Center Synchronization**:
    *   Toast notifications are now automatically persisted in the Notification Center tray.
    *   Created `useNotifications` composable for centralized state management.
3.  **Positioning**:
    *   Toast notifications now appear correctly above the taskbar (`calc(var(--taskbar-height) + 12px)`).
4.  **Taskbar Enhancements**:
    *   Added a notification count badge to the system tray.
    *   Fixed icon styling and filters in the tray area.
5.  **Functionality**:
    *   Implemented "Clear All" in the Notification Center.

## Technical Notes
- **Composables**: Use `useNotifications` for all notification-related actions.
- **Variables**: Rely on CSS variables like `--taskbar-height` for layout consistency.
- **Transitions**: Use `<Transition name="slide-notif">` for consistent toast animations.
