# Listing Approval & Rejection Emails

Add two new transactional emails sent to sellers from the admin Listings Queue, using the existing frosted-glass `emailTemplate` wrapper in `src/lib/email.ts` and the `send-email` edge function (same pattern as all other Book Loop BD emails).

## 1. Email content

### A. Listing Approved — `sellerListingApproved(sellerFirstName, bookTitle)`
- **Subject:** `Your listing "<bookTitle>" is now live on Book Loop BD`
- **Hero emoji:** ✅
- **Hero title:** `Listing approved!`
- **Hero subtitle:** `Your book is now visible to buyers across Bangladesh.`
- **Body copy:**
  > Hi <sellerFirstName>,
  >
  > Great news — your listing for **"<bookTitle>"** has been reviewed and approved by our team. It's now live on Book Loop BD and discoverable by buyers.
  >
  > **What happens next:**
  > - Buyers can view and order your book directly from the marketplace.
  > - You'll get an in-app notification and an email as soon as someone places an order.
  > - Your listing stays active for 90 days. We'll remind you 7 days before it expires.
  >
  > Tip: Share your listing link on WhatsApp or social media to reach more buyers faster.
  >
  > — The Book Loop BD Team

### B. Listing Rejected — `sellerListingRejected(sellerFirstName, bookTitle, reason)`
- **Subject:** `Update on your listing "<bookTitle>"`
- **Hero emoji:** 📝
- **Hero title:** `Listing not approved`
- **Hero subtitle:** `A small change is needed before it can go live.`
- **Body copy:**
  > Hi <sellerFirstName>,
  >
  > Thanks for submitting **"<bookTitle>"** to Book Loop BD. After review, our team wasn't able to approve this listing in its current form.
  >
  > **Reason from our team:**
  > <reason in a highlighted card — faint magenta background `rgba(232,53,122,0.08)`, rounded, left-aligned>
  >
  > **What you can do:**
  > - Review the reason above and prepare a fresh submission that addresses it.
  > - Make sure photos are clear, the condition is accurate, and the price follows our guidelines.
  > - Re-list the book from your dashboard whenever you're ready.
  >
  > If you believe this was a mistake or need clarification, reply to this email or message us on WhatsApp.
  >
  > — The Book Loop BD Team

Both emails reuse the existing wrapper (Book Loop BD header, frosted glass cards, magenta CTA button linking to the site, footer with support contact) — visually consistent with all other transactional emails.

## 2. Wiring

In `src/pages/admin/ListingsQueue.tsx`:

- **`approve(l)`** — after the existing `notifyUser(...)` in-app notification, fetch the seller's email via `getUserEmail(l.seller_id)`, derive `sellerFirstName` from their profile's `full_name` (first token, fallback `'there'`), build the email with `sellerListingApproved(...)`, and send via `sendEmail(...)`. Failures are logged but don't block the approve action (same pattern as expiry warning).
- **`reject()`** — same flow, after the in-app notify call, using `sellerListingRejected(firstName, rejectModal.name, rejectReason.trim())`.

Seller first name lookup: a single `supabase.from('profiles').select('full_name').eq('id', sellerId).maybeSingle()` call alongside the email lookup. Both queries run in parallel.

## 3. Files changed

- `src/lib/email.ts` — add `sellerListingApproved()` and `sellerListingRejected()` exports.
- `src/pages/admin/ListingsQueue.tsx` — fire the email after each admin action.

No database, edge function, RLS, or schema changes — purely additive frontend + email content.
