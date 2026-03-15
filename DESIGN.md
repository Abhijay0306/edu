```md
# Design System Documentation  
**Project:** Golearn  
**Design Style:** Modern EdTech SaaS Interface  
**Version:** 1.0

---

# 1. Design Philosophy

The Golearn interface follows a **clean, modern SaaS dashboard style** optimized for educational platforms.  
The design focuses on usability, visual clarity, and modular components.

Core principles:

- **Minimal cognitive load** through whitespace and clear layout hierarchy
- **Friendly and modern feel** using rounded corners and soft gradients
- **Card-based architecture** for modular UI development
- **Consistent spacing and typography**
- **Accessible and responsive design**

---

# 2. Color System

## Primary Brand Color

Gradient Purple

```

Start: #7B5CFF
End: #9D4EDD

```

Usage:

- Primary buttons
- Navigation highlights
- Hero sections
- CTA elements
- Active UI states

---

## Secondary Accent Colors

Used mainly in dashboards and analytics widgets.

| Color | Hex | Usage |
|------|------|------|
| Green | #4CAF50 | Success / progress |
| Blue | #5AA9FF | Analytics / info |
| Orange | #FFB74D | Notifications |
| Red | #FF6B6B | Errors / warnings |

---

## Neutral Palette

| Element | Color |
|-------|-------|
| Background | #F7F8FC |
| Surface | #FFFFFF |
| Border | #E6E8F0 |
| Primary Text | #1F2937 |
| Secondary Text | #6B7280 |
| Muted Text | #9CA3AF |

---

# 3. Typography

## Font Family

Preferred fonts:

```

Inter
Poppins
Modern Sans-serif fallback

```

Characteristics:

- High readability
- Neutral tone
- SaaS-friendly appearance

---

## Type Scale

| Element | Size | Weight |
|------|------|------|
| Hero Title | 36–44px | 700 |
| Section Title | 24–28px | 600 |
| Card Title | 18–20px | 600 |
| Body Text | 14–16px | 400 |
| Small UI Text | 12–13px | 400 |

---

# 4. Layout System

## Grid

Desktop layout uses a **12-column grid system**.

```

Max Width: 1200–1280px
Columns: 12
Gutter: 24px

```

---

## Spacing System

Spacing scale:

```

4px
8px
16px
24px
32px
48px
64px

```

Typical usage:

| Element | Spacing |
|------|------|
| Card padding | 24px |
| Section padding | 64px |
| Component gap | 16px |

---

# 5. Components

---

# 5.1 Buttons

## Primary Button

Style:

```

Height: 44px
Padding: 0 20px
Border Radius: 10px
Font Weight: 500
Background: Purple Gradient
Text: White

```

Examples:

- Register
- Join for Free
- Withdraw

---

## Secondary Button

Style:

```

Border: 1px solid #E6E8F0
Background: White
Text: Dark

```

Used for:

- Login
- Secondary actions
- Cancel buttons

---

# 5.2 Cards

Cards are the **primary UI container**.

Properties:

```

Background: White
Border Radius: 16px
Padding: 24px
Border: 1px solid #E6E8F0
Shadow: Soft elevation

```

Used for:

- Dashboard widgets
- Course listings
- Analytics panels
- Activity feeds

---

# 5.3 Metrics Widgets

Dashboard metrics include:

- icon
- metric value
- description label

Example metrics:

- Total Students
- Total Earnings
- Total Courses
- Quiz Attempts

Structure:

```

Icon
Large numeric value
Label

```

---

# 5.4 Navigation

## Top Navigation

Structure:

```

Logo | Menu Links | Search | Login | Join for Free

```

Navigation items:

- Home
- Products
- Curriculum
- Solutions
- Pricing
- Enterprise

---

## Sidebar Navigation (Dashboard)

Structure:

```

Dashboard
Courses
Students
Chat
Analytics
Calendar
Log Out

```

Design features:

- Icon + label
- Highlighted active item
- Rounded hover states

Sidebar width:

```

220px

```

---

# 5.5 Forms

Input fields:

```

Height: 44px
Border Radius: 8px
Border: 1px solid #E6E8F0
Padding: 12px
Background: White

```

States:

| State | Behavior |
|------|------|
| Focus | Purple border |
| Error | Red border |
| Disabled | Grey background |

---

# 6. Dashboard Structure

Dashboard consists of four main zones.

---

## Sidebar

Persistent navigation panel on the left.

Width:

```

220px

```

---

## KPI Metrics Row

Top section displaying analytics.

Example widgets:

- Total Students
- Total Earnings
- Total Courses
- Quiz Attempts

Layout:

```

4-card grid

```

---

## Activity Feed

Displays recent events such as:

- Course completion
- Student progress
- Reviews
- Learning activity

Structure:

```

Avatar
User name
Activity text
Status indicator

```

---

## Account / Earnings Widget

Includes:

- Total earnings
- Withdrawal button
- Balance information

---

# 7. Course Cards

Structure:

```

Course thumbnail image
Course title
Duration / metadata
Additional info

```

Properties:

```

Border Radius: 14px
Image on top
Content below
Hover elevation

```

---

# 8. Imagery Style

The design uses **human-centered photography**.

Characteristics:

- Natural lighting
- Warm tones
- Students studying
- Laptop usage
- Friendly expressions

Usage areas:

- Hero sections
- Course cards
- Marketing pages

---

# 9. Microinteractions

Animations are subtle and smooth.

Examples:

### Hover Effects

- Card elevation
- Button highlight
- Icon color change

### Transitions

```

Duration: 200ms
Easing: ease-in-out

```

---

# 10. Shadows

Card shadows:

```

Default:
0px 4px 12px rgba(0,0,0,0.06)

Hover:
0px 8px 20px rgba(0,0,0,0.08)

```

---

# 11. Border Radius

Rounded UI style.

```

Small: 8px
Medium: 12px
Large: 16px
Buttons: 10px
Cards: 16px

```

---

# 12. Accessibility

Ensure the interface supports:

- WCAG AA contrast ratios
- keyboard navigation
- visible focus indicators
- alt text for images

---

# 13. Responsive Design

## Desktop

```

Container width: 1280px
Sidebar visible
Multi-column layouts

```

## Tablet

```

2-column layouts
Collapsed sidebar
Stacked widgets

```

## Mobile

```

Single column layout
Bottom navigation
Full-width cards

```

---

# 14. UI Personality

The interface should feel:

```

Friendly
Modern
Clean
Professional
Educational

```

Avoid:

```

Overly dark UI
Heavy gradients
Cluttered layouts

```

---
```
