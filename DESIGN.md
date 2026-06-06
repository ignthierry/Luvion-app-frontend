---
name: Vivid Precision
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#b42907'
  on-secondary: '#ffffff'
  secondary-container: '#fe5d39'
  on-secondary-container: '#5b0d00'
  tertiary: '#8d22c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#a943dc'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8b1a00'
  tertiary-fixed: '#f6d9ff'
  tertiary-fixed-dim: '#e9b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#7200a3'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin: 32px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 80px
---

## Brand & Style

This design system is built upon the tension between clinical precision and exuberant energy. It adapts the "California Modernism" of Apple's ecosystem—characterized by immense white space and meticulous alignment—but injects it with a high-vibrancy chromatic soul. 

The aesthetic style is **Minimalist-Glassmorphism**. It utilizes a pure white foundation to allow high-energy gradients in orange, blue, and lavender to pop with maximum luminosity. The emotional response is one of optimistic professionalism: the UI feels expensive and controlled, yet stays dynamic and forward-leaning. It is designed for premium consumer experiences, high-end creative tools, or modern fintech platforms that want to feel alive rather than institutional.

## Colors

The palette rejects the "off-white" or "cream" trends in favor of a clinical **#FFFFFF** base. This creates a high-contrast environment where colors appear more saturated. 

- **Primary & Secondary:** An electric blue and a sunset orange serve as the main action colors.
- **Vibrancy Gradients:** These are not background fills but are used for "moments of delight"—active states, progress indicators, and hero illustrations.
- **Accents:** Soft lavender provides a sophisticated tertiary bridge between the warm orange and cool blue.
- **Neutrals:** Use a grayscale scale derived from cool blue-black to ensure legibility against the white background, avoiding muddy browns or warm grays.

## Typography

This design system uses **Plus Jakarta Sans** for its modern, geometric apertures and optimistic feel. To achieve the "high-end" look, typography must be set with **tight tracking (letter-spacing)** on all headlines to create a dense, editorial visual block.

- **Headlines:** Use Bold or ExtraBold weights with significant negative letter-spacing.
- **Body:** Maintain a clean, readable weight (Regular 400) with generous line-height to balance the tight headlines.
- **Hierarchy:** Rely on scale and weight rather than color shifts. Keep the majority of text in high-contrast dark grays/blacks.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container (max 1280px) using a 12-column structure. 

- **Whitespace:** Use aggressive vertical spacing (stack-lg/xl) between sections to maintain a minimalist, premium feel. 
- **Rhythm:** All spacing is derived from a 4px/8px base unit. 
- **Padding:** Elements like cards and buttons should have generous internal padding to avoid "crowding" the high-vibrancy content.

## Elevation & Depth

Depth in this design system is achieved through **Subtle Glassmorphism** and "Airy Shadows." 

1.  **Backdrop Blurs:** Use `backdrop-filter: blur(20px)` on semi-transparent white surfaces (#FFFFFF80) for floating headers and modals.
2.  **Thin Borders:** Every elevated container must have a 0.5px or 1px solid border. The border color should be a high-contrast, very light gray (or a low-opacity version of the primary color) to define the edge against the white background.
3.  **Shadows:** Shadows should be almost imperceptible—very large blur radii (30px-60px), very low opacity (3-5%), and a slight Y-offset to simulate a distant light source. Avoid dark or heavy shadows.

## Shapes

The shape language is consistently **Rounded (Level 2)**. 

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Containers:** Large cards and modals use a 1rem (16px) or 1.5rem (24px) radius to feel approachable and modern.
- **Consistency:** Avoid pill-shapes for anything other than tags/chips to maintain the structural, grid-aligned integrity of the design system.

## Components

### Buttons
- **Primary:** High-vibrancy gradient fill (Sunset or Electric) with white text. No shadow, or a very faint tint-matched glow on hover.
- **Secondary:** White background with a 1px high-contrast border and primary-colored text.

### Cards
- **Style:** Pure white background, 1px border (#F2F2F7), and a soft "Airy" shadow. 
- **Glass Variant:** Used for overlays; uses the 20px backdrop blur and a semi-transparent white fill.

### Input Fields
- **Style:** Subtle light gray background (#F9F9FB) that turns white on focus. 
- **Focus State:** A 2px solid border using the Primary Electric Blue.

### Chips & Tags
- **Style:** Small, high-contrast borders with a subtle tinted background (e.g., 10% opacity of the tag's color).

### Additional Components
- **Progress Blurs:** Use blurred gradient orbs in the background of the page (z-index: -1) to provide "atmosphere" without interfering with the clean UI.
- **Segmented Controls:** Apple-inspired toggles with a physical sliding white "pill" over a light gray track.