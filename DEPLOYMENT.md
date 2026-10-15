# Vercel deployment

Deploy this folder as the project root. Select Other as the framework; no install or build command is needed, and the output directory is `.`. The existing vercel.json supplies static routing, redirects, and headers. Preview helper pages are excluded by .vercelignore.

No files need to be removed. Verify the contact form delivery on the deployed preview before promoting to production. Local visual checks do not verify external message delivery.

Performance: scripts and styles use content-version query strings so unchanged files can be cached. After editing assets, run work/refresh_asset_versions.py from the parent workspace before packaging. HTML and unversioned URLs continue to revalidate. Unused asset and stylesheet recovery archives are outside the deployment folder.
