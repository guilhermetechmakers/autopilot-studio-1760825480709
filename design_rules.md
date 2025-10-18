# Design Rules for This Project

## Project Design Pattern: ---

## Visual Style

### Color Palette:
- Primary background: Deep charcoal (#18181B)
- Secondary background: Slightly lighter dark gray (#232329)
- Surface/card background: Dark gray (#222228)
- Primary text: Soft white (#F4F4F5)
- Secondary text: Muted gray (#A1A1AA)
- Accent colors: 
  - Blue (#2563EB) for active/status indicators and buttons
  - Green (#22C55E) for complete/success statuses
  - Gray (#71717A) for draft/inactive states
- UI dividers and borders: Very dark gray (#27272A)
- Button and badge backgrounds use subtle, slightly lighter/darker shades of their accent colors for contrast
- Hover states: Light opacity overlay or slight lightening of component background

### Typography & Layout:
- Font Family: Modern geometric sans-serif (e.g., Inter, SF Pro, or similar)
- Font Weights: Regular (400), Medium (500), and SemiBold (600) for headings and key UI elements
- Hierarchy: 
  - Page titles large and bold
  - Subtitles/section headers smaller, lighter
  - Table and navigation text medium/light for readability
- Spacing: Generous vertical and horizontal padding (24-32px on containers, 12-16px within components)
- Alignment: Left-aligned for navigation and content; table columns aligned for scan-ability
- Consistent grid and modular layout; clear separation between sidebar, main content, and internal cards/tables

### Key Design Elements
#### Card Design:
- Flat, borderless containers with subtle shadow or light border for separation
- Rounded corners (6-8px radius)
- Minimal elevation; emphasis on clean grouping and whitespace
- Visual hierarchy within cards: bold headers, lighter body, accent badges for status

#### Navigation:
- Vertical sidebar with compact, icon-led navigation items
- Active state: highlighted background with accent border or bolder icon/text color
- Collapsible sub-sections (e.g., Products) indicated via arrow/chevron, expanding on click
- Sidebar uses slightly darker background for separation from main content

#### Data Visualization:
- Table/grid-heavy presentation with clear delineation between rows
- Status badges with filled backgrounds and clear color coding (blue, green, gray)
- Minimal, monochrome icons for data type or quick actions
- No chart/graph elements visible in this reference, but suggest clean, flat, color-coded data viz

#### Interactive Elements:
- Buttons: Rounded rectangles, solid fill for primary actions (e.g., Export, Filters), ghost/outline for secondary
- Badges: Small, pill-shaped, strong use of accent color backgrounds and white text
- Form elements: Minimal, borderless or low-contrast with subtle focus/hover states
- Hover effects: Light background changes or subtle shadow intensification
- Switches/toggles: Rounded, accent color fill when active
- Micro-interactions: Smooth, unobtrusive transitions for state changes and navigation

### Design Philosophy
This interface embodies:
- A modern, professional, and highly minimal aesthetic
- Emphasis on clarity, focus, and reducing cognitive load for technical/business users
- Clean, distraction-free visuals supporting dense information display and quick scan-ability
- Consistent, accessible contrast and clear interactive affordances
- User experience goals: speed, efficiency, and seamless navigation across complex workflows, with visual cues for status and actionability

---

This project follows the "---

## Visual Style

### Color Palette:
- Primary background: Deep charcoal (#18181B)
- Secondary background: Slightly lighter dark gray (#232329)
- Surface/card background: Dark gray (#222228)
- Primary text: Soft white (#F4F4F5)
- Secondary text: Muted gray (#A1A1AA)
- Accent colors: 
  - Blue (#2563EB) for active/status indicators and buttons
  - Green (#22C55E) for complete/success statuses
  - Gray (#71717A) for draft/inactive states
- UI dividers and borders: Very dark gray (#27272A)
- Button and badge backgrounds use subtle, slightly lighter/darker shades of their accent colors for contrast
- Hover states: Light opacity overlay or slight lightening of component background

### Typography & Layout:
- Font Family: Modern geometric sans-serif (e.g., Inter, SF Pro, or similar)
- Font Weights: Regular (400), Medium (500), and SemiBold (600) for headings and key UI elements
- Hierarchy: 
  - Page titles large and bold
  - Subtitles/section headers smaller, lighter
  - Table and navigation text medium/light for readability
- Spacing: Generous vertical and horizontal padding (24-32px on containers, 12-16px within components)
- Alignment: Left-aligned for navigation and content; table columns aligned for scan-ability
- Consistent grid and modular layout; clear separation between sidebar, main content, and internal cards/tables

### Key Design Elements
#### Card Design:
- Flat, borderless containers with subtle shadow or light border for separation
- Rounded corners (6-8px radius)
- Minimal elevation; emphasis on clean grouping and whitespace
- Visual hierarchy within cards: bold headers, lighter body, accent badges for status

#### Navigation:
- Vertical sidebar with compact, icon-led navigation items
- Active state: highlighted background with accent border or bolder icon/text color
- Collapsible sub-sections (e.g., Products) indicated via arrow/chevron, expanding on click
- Sidebar uses slightly darker background for separation from main content

#### Data Visualization:
- Table/grid-heavy presentation with clear delineation between rows
- Status badges with filled backgrounds and clear color coding (blue, green, gray)
- Minimal, monochrome icons for data type or quick actions
- No chart/graph elements visible in this reference, but suggest clean, flat, color-coded data viz

#### Interactive Elements:
- Buttons: Rounded rectangles, solid fill for primary actions (e.g., Export, Filters), ghost/outline for secondary
- Badges: Small, pill-shaped, strong use of accent color backgrounds and white text
- Form elements: Minimal, borderless or low-contrast with subtle focus/hover states
- Hover effects: Light background changes or subtle shadow intensification
- Switches/toggles: Rounded, accent color fill when active
- Micro-interactions: Smooth, unobtrusive transitions for state changes and navigation

### Design Philosophy
This interface embodies:
- A modern, professional, and highly minimal aesthetic
- Emphasis on clarity, focus, and reducing cognitive load for technical/business users
- Clean, distraction-free visuals supporting dense information display and quick scan-ability
- Consistent, accessible contrast and clear interactive affordances
- User experience goals: speed, efficiency, and seamless navigation across complex workflows, with visual cues for status and actionability

---" design pattern.
All design decisions should align with this pattern's best practices.

## 🌓 Dark/Light Mode Requirements (CRITICAL)

**THIS PROJECT MUST SUPPORT BOTH DARK AND LIGHT MODES**

- Never create single-mode UI (light-only or dark-only)
- Use CSS custom properties for all theme colors
- Theme toggle component is implemented and accessible
- Support: light, dark, and system (follows OS preference)
- Persist user's theme choice in localStorage
- Smooth transitions between themes (200-300ms)
- Test all components in both themes
- Maintain WCAG AA contrast in both modes

**Implementation:**
- Theme provider available at `src/components/theme-provider.tsx`
- Theme toggle available at `src/components/ui/theme-toggle.tsx`
- All colors use `hsl(var(--variable))` pattern
- Light mode defined in `:root`
- Dark mode defined in `.dark` class

---

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)
- Adjust shadow intensity based on theme (lighter in dark mode)

---

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions
9. **Be Themeable** - Support both dark and light modes seamlessly

---

