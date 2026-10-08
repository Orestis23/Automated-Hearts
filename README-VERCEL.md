# Responsive verification — October 5, 2026

Six public pages checked at 17 viewport sizes (102 combinations): Home, Industries, Solution, Good Information, Services, Privacy Policy.

Portrait and desktop: 320×568, 360×800, 390×844, 430×932, 768×1024, 820×1180, 900×600, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, 2560×1440.
Additional orientations and containers: 844×390, 932×430, 1180×820, 540×720.

Final checks found no document or main-content horizontal overflow, visible broken images, or navigation controls outside the viewport. The homepage title and image-link rows were corrected to fit laptop content bounds. Small-phone contact fields now fit inside the gold rim; short landscape forms allow scrolling when necessary. Model instructions have reserved space on short screens. Edited scripts passed syntax checks; responsive source documents parse correctly. Local HTML/CSS asset references resolved.

Vercel: framework preset Other, no build command, output directory `.`. Deploy the directory containing index.html and vercel.json. The local preview and audit pages are outside the deployment directory.

Browser emulation covers layout, not every physical device, mobile keyboard, touch implementation, or live Vercel behavior. Form submissions were not sent. The audit harness can cancel pending transitions during frame replacement; normal page loads were separately inspected.


## Startup improvements — October 8, 2026

The six public responsive entry points display a lightweight loading message before artwork and fonts are ready. The message is independent of body visibility and legacy pseudo-element styling, then gives way to the existing first-visit intro or finished page. Page readiness no longer waits for the embedded Critical Information frame or a second host-frame fallback. Visible materials and required fonts still decode before the page reveal. Optional typing audio does not block the visible intro. Gold-rim reads are batched before style writes, and unchanged styles are not rewritten. Duplicate preload hints were removed; shared materials start in the wrapper, with lower priority for the 3D library.

Locally verified: desktop 1440 px and mobile 390 px, all six page reveals, intro replay, Practical AI model opening and returning, loader removal, final artwork/rims and script syntax. Local cached timings are not physical-phone or production-network benchmarks. Obsolete scripts confirmed unreachable from public entry points are excluded from this deployment ZIP; they remain in the working folder and older ZIPs.


## CSS and machine rims — October 8, 2026

Stylesheets adjacent in the original cascade are combined without moving rules across inline styles or scripts. Common sequences are shared across pages; formatting is compacted while preserving strings, comments, conditional rules, and asset paths. An unfinished block in the legacy mobile transition sheet is explicitly closed at its original end-of-file boundary so combining files preserves the browser's original parsing. The already-selected desktop homepage declares its core CSS directly, replacing its document.write chooser. No artwork resolution or compression quality was changed.

Mobile homepage machine windows use a 2.25 px hammered-gold band to match the apparent weight of desktop windows; the mobile Solution model shell retains its thin gold band. The outer viewport rim is unchanged. The rim updater avoids resetting its own border image; the obsolete SVG renderer behind an unconditional return has been removed.

Validation: all six public page reveals inspected in desktop and mobile previews; homepage dimensions, typography and materials compared with the previous build; Practical AI open/return checked on both; embedded sources and rim script syntax checked; combined CSS local asset references all resolve. Physical-device network benchmarks and form submission are not included in these checks. Original source assets remain in the workspace; unreachable obsolete CSS/JS and temporary comparison fixtures are excluded from the ZIP.
