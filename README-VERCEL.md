# Responsive verification — October 5, 2026

Six public pages checked at 17 viewport sizes (102 combinations): Home, Industries, Solution, Good Information, Services, Privacy Policy.

Portrait and desktop: 320×568, 360×800, 390×844, 430×932, 768×1024, 820×1180, 900×600, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, 2560×1440.
Additional orientations and containers: 844×390, 932×430, 1180×820, 540×720.

Final checks found no document or main-content horizontal overflow, visible broken images, or navigation controls outside the viewport. The homepage title and image-link rows were corrected to fit laptop content bounds. Small-phone contact fields now fit inside the gold rim; short landscape forms allow scrolling when necessary. Model instructions have reserved space on short screens. Edited scripts passed syntax checks; responsive source documents parse correctly. Local HTML/CSS asset references resolved.

Vercel: framework preset Other, no build command, output directory `.`. Deploy the directory containing index.html and vercel.json. The local preview and audit pages are outside the deployment directory.

Browser emulation covers layout, not every physical device, mobile keyboard, touch implementation, or live Vercel behavior. Form submissions were not sent. The audit harness can cancel pending transitions during frame replacement; normal page loads were separately inspected.
