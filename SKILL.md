---
name: design-guide
description: Modern UI design standards and principles for creating clean, professional interfaces. Use when building any UI component, web interface, React artifact, HTML page, or visual design. Ensures consistent spacing, color usage, typography, and interactive states across all UI work.
---

# Design Guide

Ensure every UI built follows modern, professional design standards with clean aesthetics and thoughtful user experience.

## Core Design Principles

### 1. Clean and Minimal Layout
- Embrace white space - let elements breathe
- Avoid cluttered interfaces
- Each element should have purpose
- Remove unnecessary visual noise

### 2. Color System

**Base Palette:**
- Use grays (#f8f9fa, #e9ecef, #dee2e6, #ced4da, #adb5bd) and off-whites as foundation
- ONE accent color used sparingly for CTAs and important actions
- Maintain high contrast ratios for accessibility (4.5:1 for text)

**Prohibited:**
- NO generic purple/blue gradients
- NO rainbow gradients
- NO unnecessary color variety - stick to neutral base + single accent

### 3. Spacing System (8px Grid)
Maintain consistent spacing using multiples of 8:
- 8px - tight spacing (icon-to-label)
- 16px - default spacing between related elements
- 24px - spacing between component groups
- 32px - section padding
- 48px - large section gaps
- 64px - major layout divisions

Never use arbitrary spacing values. Always round to nearest 8px multiple.

### 4. Typography

**Hierarchy:**
- H1: 32-40px (page titles)
- H2: 24-28px (section headers)
- H3: 20-24px (subsections)
- Body: 16px minimum (never smaller for readability)
- Small text: 14px (metadata, captions)

**Font Rules:**
- Maximum 2 font families per interface
- Use system fonts when possible: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- Maintain clear visual hierarchy through size, not color alone
- Line height: 1.5-1.6 for body text

### 5. Shadows and Depth
- Use subtle shadows: box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
- Avoid heavy or dramatic shadows
- Reserve stronger shadows for modals/elevated elements
- Prefer borders over shadows when appropriate

### 6. Border Radius
- Not everything needs to be rounded
- Use consistently: 4px (subtle), 8px (moderate), 12px (pronounced)
- Sharp corners acceptable for cards and containers
- Fully rounded only for avatars, pills, or specific design intent

### 7. Interactive States
Every interactive element must have clear states:
- **Default:** Base styling
- **Hover:** Subtle background change or slight shadow increase
- **Active:** Slightly darker or more pronounced
- **Disabled:** Reduced opacity (0.5-0.6), cursor: not-allowed
- **Focus:** Visible outline for keyboard navigation

## Component Guidelines

### Buttons
```
✓ GOOD:
- Padding: 12px 24px (using 8px grid)
- Subtle shadow on default
- Clear hover state (slightly darker background)
- No gradients
- Accent color for primary actions
- Gray/neutral for secondary actions

✗ BAD:
- Gradient backgrounds
- No hover states
- Inconsistent padding
- Tiny click targets (<44px height)
```

### Cards
```
✓ GOOD:
- Clean borders (1px solid #e9ecef) OR subtle shadows
- Never both border AND heavy shadow
- Adequate padding (24px or 32px)
- Clear content hierarchy within

✗ BAD:
- Heavy shadows AND borders
- Cramped content
- Inconsistent card styling
```

### Forms
```
✓ GOOD:
- Labels above inputs, clear and readable
- 16px spacing between fields
- Clear error states (red accent + message)
- Input height: 40-48px minimum
- Focus state with visible outline

✗ BAD:
- Unclear label positioning
- Tiny inputs
- No error messaging
- Missing focus states
```

### Layout Containers
```
✓ GOOD:
- Max width for readability (1200px-1400px)
- Responsive padding (24px mobile, 48px desktop)
- Use CSS Grid or Flexbox for alignment
- Mobile-first approach

✗ BAD:
- Full-width text on wide screens
- Inconsistent container padding
- Desktop-only considerations
```

## Mobile-First Approach
- Design for mobile screens first
- Use responsive breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch targets minimum 44x44px
- Test interactions on small screens

## Quality Checklist
Before finalizing any UI, verify:
- [ ] Spacing follows 8px grid system
- [ ] Only one accent color used
- [ ] Typography hierarchy is clear
- [ ] All interactive elements have hover/active/focus states
- [ ] Minimum 16px body text size
- [ ] Adequate white space throughout
- [ ] No generic gradients
- [ ] Mobile responsive
- [ ] Shadows are subtle, not overdone
- [ ] High contrast for accessibility

## Implementation Notes

When creating React artifacts:
- Use Tailwind utility classes aligned with these principles
- Leverage Tailwind's spacing scale (matching 8px grid)
- Utilize Tailwind's gray palette for neutral colors
- Define single accent color using Tailwind's color system

When creating HTML/CSS:
- Define CSS custom properties for consistent spacing
- Use CSS Grid/Flexbox for layouts
- Implement hover states with transitions
- Ensure cross-browser compatibility
