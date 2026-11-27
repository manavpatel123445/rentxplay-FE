# Glossary

Use these words in code, UI and docs. One name per concept.

| Term | Meaning | In code |
| --- | --- | --- |
| Item | A gadget an owner lists for rent | `Item` (`src/lib/types.ts`) |
| Listing | The item's public page and settings (price, deposit, availability) | — |
| Owner | User who lends an item | `item.owner` |
| Renter | User who borrows an item | — |
| Booking | One rental of one item for a date range | (API) `Booking` |
| Booking status | REQUESTED → APPROVED → PAID → PICKED_UP → RETURNED → COMPLETED; side states REJECTED, EXPIRED, CANCELLED, DISPUTED | (API) enum |
| Rental days | Return date minus pickup date, minimum 1 | `rentalDays()` |
| Price tiers | Per-day rate for 1 day, 3+ days, 7+ days | `PriceTiers` |
| Service fee | 10% of rent, paid by the renter | `SERVICE_FEE_RATE` |
| Commission | 5% of rent kept from the owner's payout | (API) |
| Deposit | Refundable amount held until return is confirmed | `item.deposit` |
| Handover | How the renter gets the item: `pickup` or `delivery` | `Handover` |
| Delivery fee / radius | Owner-set fee and max distance for delivery | `deliveryFee`, `deliveryRadiusKm` |
| Unavailable dates | Dates booked or blocked by the owner | `item.unavailable` |
| Quote | Price breakdown for chosen dates and handover | `quote()` |
| Dispute | Claim of damage or missing parts after return; admin splits the deposit | (API) |
| Area | Ahmedabad neighbourhood of the owner (Satellite, Bodakdev…) | `item.area` |
