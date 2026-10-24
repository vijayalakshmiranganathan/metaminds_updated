---
name: Clinical Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#40484c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#70787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#1e667f'
  primary: '#004357'
  on-primary: '#ffffff'
  primary-container: '#0d5c75'
  on-primary-container: '#93d3ef'
  inverse-primary: '#90cfec'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#00472f'
  on-tertiary: '#ffffff'
  tertiary-container: '#006141'
  on-tertiary-container: '#52e1a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bde9ff'
  primary-fixed-dim: '#90cfec'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d64'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-metric:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is tailored for clinical rounds, rapid point-of-care decisions, and electronic health record (EHR) management. Designed specifically for physicians, triage nurses, and hospital care teams operating under high-cognitive-load, time-sensitive circumstances, the interface prioritizes immediate legibility, zero ambiguity, and high clinical authority.

The aesthetic fuses **Modern Functionalism** with **Clinical Minimalism**. It eschews decorative fluff in favor of razor-sharp information hierarchy, structured visual triage, and calm, ergonomic touch targets engineered for single-handed mobile navigation during physical bedside examinations. The emotional tone is authoritative, reassuring, surgically precise, and sterile without feeling cold.

## Colors

The palette establishes an immediate clinical hierarchy: deep teal serves as the anchor of trust and authority, vivid sky blue guides operational actions, and deliberate status tokens communicate patient acuity instantly.

### Palette Architecture
- **Primary (`#0D5C75`):** Deep Clinical Marine. Used for top app bars, primary navigational structures, key operational headers, and high-emphasis active navigation states.
- **Secondary (`#0284C7`):** Precision Medical Cyan. Applied to interactive UI elements, primary buttons, actionable toggles, and direct patient interaction workflows.
- **Tertiary / Stable (`#10B981`):** Medical Mint/Emerald. Reserved exclusively for normal physiological readings, verified dosages, approved discharge states, and stable vitals. Paired with `#ECFDF5` for tinted badge fills.
- **Critical / Urgent Alert (`#EF4444`):** Emergency Red. Strictly reserved for life-critical notifications, severe drug allergies, DNR status markers, and out-of-range deteriorating vitals. Paired with `#FEF2F2` for warning containers.
- **Warning / Review (`#F59E0B`):** Clinical Amber. Applied to pending lab orders, moderate triage (ESI Level 3), non-life-threatening allergies, and dosage verification prompts.
- **Neutral Hierarchy:** Slate tones (`#0F172A` text-primary, `#334155` text-secondary, `#64748B` text-tertiary/icons, `#94A3B8` borders-active, `#E2E8F0` hairline borders, `#F8FAFC` background-canvas). Pure `#FFFFFF` is isolated strictly to interactive clinical cards and modal sheets.

## Typography

Typography is powered entirely by **Inter**, selected for its neutral mechanical geometry, tall x-height, and extensive OpenType feature set. 

### Tabular Numbers & Diagnostic Precision
All patient vitals (e.g., blood pressure `120/80`, pulse `72 bpm`, SpO2 `98%`), medication dosages (`500 mg`), timestamps, and medical record numbers (MRN) must enforce OpenType tabular figures (`font-variant-numeric: tabular-nums;` / `tnum`). This prevents layout shifting during real-time telemetry streaming and aligns decimal values across clinical observation tables.

### Structural Scale
- **Headlines:** Dense and compact to ensure long clinical patient names (e.g., "Fitzgerald-Montgomery, Eleanor") do not truncate prematurely.
- **Labels:** High-contrast, micro-uppercase treatment (`label-sm`) is strictly applied to status tags, triage badges, and allergy alerts to ensure instant peripheral visibility.
- **Body:** Calibrated line heights prevent eye-tracking errors when reading dense physician notes and multi-line medication instructions.

## Layout & Spacing

This design system uses a compact, fluid mobile layout system optimized for hand-held hardware (smartphones and enterprise handheld barcode scanners).

### Layout Grid & Bounds
- **Canvas Grid:** 4-column fluid grid for mobile screens (<600px), expanding to 8 columns on medical tablets.
- **Gutters & Margins:** Default 12px (`0.75rem`) margin on compact viewports to maximize clinical data density without edge clipping; 16px (`1rem`) on standard mobile viewports.
- **Vertical Rhythm:** 4px base increment. All tap targets adhere strictly to an absolute minimum dimension of 44×44px (recommended 48px) to accommodate gloved interaction in fast-paced clinical environments.
- **Safe Area Insets:** Fixed bottom action bars must include extra padding accounting for iOS Home Indicator and Android system bars plus a mandatory 8px clear buffer.

## Elevation & Depth

To preserve sterility and avoid visual fatigue during 12-hour shifts, the interface relies on **tonal layered surfaces** and **hairline boundaries** rather than heavy blurred shadows.

### Surface Tiers
- **Tier 0 (Canvas Base):** `#F8FAFC`. The foundational backdrop for patient lists, patient charts, and record feeds.
- **Tier 1 (Surface Containers):** `#FFFFFF`. Used for patient record cards, lab telemetry blocks, and medication administration records (MAR). Every surface card is defined with a crisp `1px solid #E2E8F0` border.
- **Tier 2 (Sticky Headers & Context Bars):** `#FFFFFF` with a `backdrop-filter: blur(8px)` and an ambient bottom boundary line `1px solid #CBD5E1`.
- **Tier 3 (Modals & Bedside Action Sheets):** `#FFFFFF` paired with an ultra-soft, clinical ambient shadow: `0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`.

Shadows are never saturated or colored; they remain neutral charcoal (`#0F172A`) at micro-opacities to preserve diagnostic focus.

## Shapes

The shape architecture balances clinical professionalism with modern ergonomic comfort.

- **Standard Containers (`rounded-md`, 8px / 0.5rem):** Applied to clinical record cards, input fields, vitals panels, and medical image containers. Provides a structured, tidy appearance.
- **Interactive Controls (`rounded-lg`, 16px / 1rem):** Applied to action sheets, bottom navigation tabs, and primary medication verification buttons for touch-friendly ergonomics.
- **Status Indicators & Triage Pills (`rounded-full`, 9999px):** Applied to high-contrast allergy badges, triage urgency tags (Urgent, Moderate, Stable), and dosage frequency markers. The full pill shape visually isolates categorical clinical metadata from functional data fields.

## Components

### Buttons
- **Primary Clinical Action:** Background `#0284C7`, text `#FFFFFF`, height 48px, radius 8px, font `label-lg`. Tap feedback uses `#0369A1`.
- **Destructive / Alert Action:** Background `#EF4444`, text `#FFFFFF`, height 48px, radius 8px. Used for code alerts, emergency overrides, or allergy confirmations.
- **Secondary / Ghost:** White background `#FFFFFF`, border `1px solid #CBD5E1`, text `#334155`.

### Badges & Triage Status Indicators
- **High-Alert / Allergy Badges:** Fill `#FEF2F2`, border `1px solid #FECACA`, text `#B91C1C`, icon `alert-circle`. Must always pair an explicit text label with a clinical icon for accessibility.
- **Triage Level 1 (Urgent / Immediate):** Fill `#EF4444`, text `#FFFFFF`, bold tabular indicator.
- **Triage Level 2 (Moderate / Delayed):** Fill `#FEF3C7`, text `#92400E`, border `1px solid #FDE68A`.
- **Triage Level 3 (Stable / Routine):** Fill `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`.

### Patient Header & Medication Cards
- **Patient Banner Card:** Pure `#FFFFFF` background, `1px solid #E2E8F0` border, `8px` roundedness. Left-aligned patient avatar, full legal name in `headline-sm`, MRN and DOB rendered in `body-sm` (`#64748B`, tabular numbers). Pinned allergy badges sit directly beneath the patient demographics.
- **Medication Administration Card (MAR):** Two-tone layout with left vertical triage accent bar (4px wide, status-coded). Displays drug generic name in `label-lg`, dosage and route in bold tabular typography, and a distinct schedule badge (e.g., `08:00 Q8H`).

### Vitals & Telemetry Display
- Multi-column grid containing metric cells: metric title in `label-sm` (`#64748B`), primary numeric reading in `data-metric` (`#0F172A`, tabular numbers), and reference range label in `body-sm`. If out of range, the numerical value transitions to `#EF4444` accompanied by a directional micro-indicator (`▲` / `▼`).

### Form Inputs & Clinical Pickers
- **Input Fields:** 48px height, `#FFFFFF` background, `1px solid #CBD5E1` border, `8px` radius. Focused state adopts a crisp `2px solid #0284C7` ring with no soft glow.
- **Segmented Dosing Selectors:** Enclosed slate container `#F1F5F9` with a sliding white `#FFFFFF` segment pill to avoid incorrect dosage unit selection.