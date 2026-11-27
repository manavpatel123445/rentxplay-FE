# GearLoop — User Flows & Wireframes

Nov 27, 2026 · @Yudiz

GearLoop has 23 screens across three roles; a renter reaches a paid booking in 5 screens, and the four wireframes below cover the screens the MVP depends on most.

## Screen inventory

15 of the 23 screens are MVP. Per the PRD decisions, launch is Ahmedabad only, and owners can offer delivery for a fee as well as pickup.

| ID | Screen | Role | What it holds | Phase |
| --- | --- | --- | --- | --- |
| S01 | Home | Guest, renter | Search bar (item, area, dates), categories, popular items in Ahmedabad | MVP |
| S02 | Search results | Guest, renter | Filters (category, price, dates, delivery available), sort, item cards, cursor pagination | MVP |
| S03 | Product detail | Guest, renter | Photos, price tiers, deposit, availability calendar, pickup or delivery (with fee), owner card, reviews, booking panel | MVP |
| S04 | Log in / Sign up | Guest | Email + password, link to sign up, forgot password | MVP |
| S05 | OTP verification | Guest | 6-digit code, resend timer, attempts left | MVP |
| S06 | Booking checkout | Renter | Dates, pickup or delivery address, price breakdown (rent, service fee, delivery fee, deposit), send request | MVP |
| S07 | Payment | Renter | Razorpay test checkout, 30-minute countdown, amount summary | MVP |
| S08 | My bookings | Renter | Tabs: Requested, Upcoming, Active, Past; status chip on each card | MVP |
| S09 | Booking detail | Renter, owner | Status timeline, actions for the current status, pickup/return photos, owner or renter contact after payment, cancel | MVP |
| S10 | Write review | Renter, owner | 1–5 stars, comment, shown after completion | MVP |
| S11 | Chat | Renter, owner | Messages per booking, photo attach | Phase 2 |
| S12 | Notifications | All | Request, approval, payment, reminder and dispute alerts | Phase 2 |
| S13 | Create / edit listing | Owner | 4 steps: details, photos, pricing + deposit, pickup area + delivery fee and radius | MVP |
| S14 | My listings | Owner | Each listing with status (pending, live, paused), edit, pause | MVP |
| S15 | Availability calendar | Owner | Month view, block and unblock dates, booked days shown | MVP |
| S16 | Booking requests | Owner | Incoming requests with dates, renter rating, price, approve/reject, 24-hour countdown | MVP |
| S17 | Earnings | Owner | Rent earned, commission, payout status per booking | Phase 2 |
| S18 | Profile & settings | All | Photo, phone, verification badge, saved addresses, log out | MVP |
| S19 | Raise dispute | Renter, owner | Reason, photos, amount claimed | Phase 2 |
| S20 | Admin dashboard | Admin | Counts of users, listings, bookings, revenue, open disputes | Phase 2 |
| S21 | Listing moderation | Admin | Pending listings queue, approve or reject with reason | Phase 2 |
| S22 | Disputes | Admin | Dispute detail, both sides' photos, deposit split decision | Phase 2 |
| S23 | Users & verification | Admin | User list, mock KYC review, block user | Phase 2 |

## Navigation map

&#91;embedded content: navigation map · 4 tabs, 19 app screens, admin app\]

Booking detail (S09) is the hub both sides return to: a renter lands there after paying, an owner after approving a request.

## Renter flow

&#91;embedded content: renter flow · 8 steps, 3 decisions\]

Screens used, in order: S02 and S03 to find and choose, S06 to request, S07 to pay, S09 for handover and return, S19 if there is a dispute, and S10 for the review.

## Owner flow

&#91;embedded content: owner flow · 7 steps, 3 decisions\]

Screens used, in order: S13 to list, S15 to block dates, S16 to approve, S09 for handover and return, S19 for a dispute, S17 for earnings and S10 for the review. Payout is rent minus the 5% commission.

## Admin flow

The admin works three queues from the dashboard (S20); all of this is Phase 2.

1. Log in with an admin account and land on the dashboard (S20).
2. **Listings (S21):** open the oldest pending listing, check photos and price, then approve (goes live) or reject with a reason (owner is notified).
3. **Verification (S23):** open a pending mock-KYC request, compare the demo document with the profile, then approve (badge shown) or reject.
4. **Disputes (S22):** open a dispute, compare pickup and return photos from both sides, set how much deposit the owner keeps, and confirm; the booking moves to COMPLETED and the rest of the deposit is refunded.
5. **Users (S23):** block a user who breaks the rules; their listings pause and open requests are cancelled.

## Wireframes

These four screens carry the MVP: finding an item, deciding to book, pricing a listing, and tracking a booking. They are low-fidelity layouts, not visual design.

&#91;embedded content: wireframes · S02 search results and S03 product detail\]

Search cards show the per-day price, distance and delivery fee so renters can compare without opening each item; the product page keeps the booking total and button fixed at the bottom.

&#91;embedded content: wireframes · S13 create listing (pricing) and S09 booking detail\]

The booking page always shows one primary action for the current status (here: upload handover photos), and the price summary matches the PRD rules: ₹1,200 rent + 10% fee + ₹100 delivery + ₹5,000 deposit = ₹6,420.

## Screen states

Every data screen shows a skeleton while loading and a retry button on a network error; the table lists what differs per screen.

| Screen | Empty state | Error or edge state |
| --- | --- | --- |
| S02 Search results | "No items match. Try other dates or remove a filter" + clear-filters button | Location not allowed: fall back to Ahmedabad city centre |
| S03 Product detail | — | Listing paused or removed: "This item is no longer available" + similar items |
| S05 OTP | — | Wrong code: attempts left shown; after 5, locked for 15 minutes |
| S06 Booking checkout | — | Dates just taken by someone else: "These dates were just booked" + calendar reopened; delivery address outside the owner's radius: delivery option disabled |
| S07 Payment | — | Countdown ends: "Booking expired, dates released"; payment failed: retry within the same window |
| S08 My bookings | "No bookings yet" + browse button | — |
| S09 Booking detail | — | Action no longer valid (status changed elsewhere): reload with a toast |
| S11 Chat | "Say hi to arrange pickup" | Message failed: retry icon on the bubble |
| S13 Create listing | — | Photo upload fails: retry per photo; fewer than 3 photos: next step disabled |
| S14 My listings | "List your first item" + create button | Listing rejected: reason shown with edit button |
| S16 Booking requests | "No requests right now" | Request expired while open: card greys out |

## Open questions

- [ ] Web first and mobile (Flutter) later, or both screens designed now?
- [ ] Does the owner set one flat delivery fee, or a fee per km within a radius?
- [ ] Show the owner's exact pickup address only after payment (assumed), or the area only until pickup day?
- [ ] Light theme only for the MVP, or light and dark?
- [ ] Map view on search results in the MVP, or Phase 2 with nearby search?
