# Task Checklist — Habit Tracker Sales Site

## Scaffolding
- [ ] package.json, tsconfig, next.config, postcss, eslint, .gitignore
- [ ] .env.example (no secrets)
- [ ] app/globals.css + app/layout.tsx

## Config & libs (server-only)
- [ ] lib/config.ts
- [ ] lib/format.ts
- [ ] lib/xendit.ts
- [ ] lib/supabaseAdmin.ts
- [ ] lib/resend.ts
- [ ] lib/purchases.ts

## Landing page
- [ ] components: Hero, WhatYouGet, Screenshots, PriceBlock, Faq, BuySection, Footer
- [ ] app/page.tsx
- [ ] public placeholder images

## API routes
- [ ] app/api/checkout/route.ts
- [ ] app/api/webhooks/xendit/route.ts

## Delivery + success
- [ ] app/download/[token]/page.tsx
- [ ] app/download/[token]/deliver/route.ts
- [ ] app/thank-you/page.tsx + ProcessingRefresh
- [ ] app/payment-failed/page.tsx
- [ ] app/terms + app/privacy

## Database
- [ ] supabase/migrations/0001_purchases.sql

## Docs
- [ ] README.md
- [ ] DEPLOY.md

## Verify
- [ ] npm install
- [ ] npm run build passes
- [ ] no secrets committed
- [ ] commit + push
