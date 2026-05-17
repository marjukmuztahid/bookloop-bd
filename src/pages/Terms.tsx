import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const Terms = () => {
  useSEO({ title: 'Terms & Conditions — Book Loop BD', description: 'Marketplace rules, seller and buyer obligations, payment terms, and platform policies for Book Loop BD.', canonicalPath: '/terms' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Terms and Conditions</span>
        </nav>

        <div className="glass-panel p-6 sm:p-10">
          <h1 className="mb-2 text-2xl font-bold text-primary sm:text-3xl">TERMS AND CONDITIONS</h1>
          <p className="mb-8 text-sm text-muted-foreground">Effective Date: January 1, 2026 &nbsp;·&nbsp; Last Updated: January 1, 2026</p>

          <Section title="1. About Book Loop BD">
            <p>Book Loop BD (“we”, “us”, “our”, the “Platform”) is an online marketplace operated from Bangladesh that connects students and parents who wish to buy and sell second-hand school and college curriculum books. The Platform provides the technology, payment workflow, order management, customer support, and delivery coordination required to complete each transaction safely and conveniently.</p>
            <p>These Terms and Conditions (the “Terms”) form a legally binding agreement between you and Book Loop BD. By creating an account, browsing listings, placing an order, posting a listing, or otherwise using the Platform, you agree to be bound by these Terms together with our <Link to="/privacy-policy" className="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</Link>. If you do not agree with any part of these Terms, please do not use the Platform.</p>
          </Section>

          <Section title="2. Definitions">
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Buyer</strong> — a registered user who places an order to purchase a book listed on the Platform.</li>
              <li><strong>Seller</strong> — a registered user who lists a book for sale on the Platform.</li>
              <li><strong>Listing</strong> — a published offer to sell a specific book on the Platform.</li>
              <li><strong>Order</strong> — a buyer’s confirmed request to purchase a listed book.</li>
              <li><strong>Courier</strong> — Steadfast Courier or any other logistics partner we designate.</li>
              <li><strong>COD</strong> — Cash on Delivery, the payment method used on the Platform.</li>
              <li><strong>Platform Fee</strong> — the 10% commission Book Loop BD retains on each successful sale.</li>
              <li><strong>Admin</strong> — the Book Loop BD operational team responsible for moderation, approvals, and dispute resolution.</li>
            </ul>
          </Section>

          <Section title="3. Eligibility">
            <ul className="list-disc space-y-1 pl-5">
              <li>The Platform is intended primarily for school and college students in Bangladesh, as well as their parents or guardians acting on their behalf.</li>
              <li>You must reside in Bangladesh and be capable of providing a valid pickup or delivery address within one of the 64 districts.</li>
              <li>If you are under the age of 18, you may use the Platform only with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms on your behalf.</li>
              <li>By registering, you confirm that the information you provide is accurate, current, and complete, and that you have the legal capacity to enter into this agreement.</li>
              <li>The Platform currently does not serve university-level curriculum, professional reference books, foreign editions outside our supported curriculums, or any non-book item.</li>
            </ul>
          </Section>

          <Section title="4. User Accounts">
            <ul className="list-disc space-y-1 pl-5">
              <li>Every user registers a single unified account that supports both buying and selling.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</li>
              <li>You must notify us immediately if you suspect unauthorised access to your account.</li>
              <li>You may not create multiple accounts, share your account, or transfer your account to another person.</li>
              <li>You must use your real name, an active phone number, a valid email address, and your actual district during sign-up. Providing false information may result in suspension or permanent ban.</li>
              <li>Sellers must add a verified bKash or Nagad number to their profile before posting any listing. Payouts will only be sent to the registered number.</li>
              <li>We reserve the right to suspend or permanently terminate any account that violates these Terms, engages in fraud, harms other users, or undermines the integrity of the Platform.</li>
            </ul>
          </Section>

          <Section title="5. Listing Rules for Sellers">
            <p>When you post a listing on Book Loop BD, you represent and warrant that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>You are the lawful owner of the book and have full authority to sell it.</li>
              <li>The book is currently in your physical possession at the address provided.</li>
              <li>The book is genuine, not pirated, photocopied, illegally reproduced, or otherwise infringing on any intellectual-property rights.</li>
              <li>All listing details — including book name, author, curriculum, class, condition (New, Good, Fair, or Worn), weight, and price — are accurate and not misleading.</li>
              <li>The photographs you upload (maximum of 3 per listing) depict the actual book you are selling and are not stock images or photos taken from other websites.</li>
              <li>You have not posted a duplicate listing for the same physical copy of the book.</li>
              <li>You are not attempting to circumvent the Platform’s pricing or fee structure.</li>
            </ul>
            <p className="mt-2">Additional rules:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Once a listing is submitted, sellers cannot edit it. To change information, the listing must be deleted and re-created (subject to admin approval).</li>
              <li>Listings are reviewed by the admin before going live. Misleading, low-quality, fraudulent, or rule-breaking listings will be rejected without obligation to explain.</li>
              <li>Approved listings that remain unsold are automatically removed after 60 days. A warning email is sent 7 days before removal.</li>
              <li>The admin may remove any listing at any time, with notification to the seller, if it violates these Terms or any applicable law.</li>
            </ul>
          </Section>

          <Section title="6. Pricing, Platform Fee, and Display Price">
            <ul className="list-disc space-y-1 pl-5">
              <li>Sellers enter their desired asking price (the amount they want to receive after a successful sale).</li>
              <li>The Platform automatically adds a 10% Platform Fee on top of the asking price to compute the buyer-facing display price.</li>
              <li>The display price shown to the buyer is therefore: <em>seller’s asking price + 10% Platform Fee</em>. Delivery charges are added separately at checkout.</li>
              <li>Sellers are paid their full original asking price via bKash or Nagad after a successful Cash on Delivery transaction is completed and remitted by the courier.</li>
              <li>The Platform Fee is non-refundable once a sale is successfully completed.</li>
              <li>Book Loop BD reserves the right to update the Platform Fee structure in future, with prior notice posted on this page.</li>
            </ul>
          </Section>

          <Section title="7. Delivery, Courier, and Shipping Charges">
            <ul className="list-disc space-y-1 pl-5">
              <li>All deliveries are handled exclusively by our logistics partner, Steadfast Courier.</li>
              <li>Delivery charges depend on the weight of the book and whether the buyer and seller are within Dhaka or in different districts:
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>Under 2kg: ৳90 within Dhaka, ৳120 for other districts.</li>
                  <li>2kg to 4kg: ৳110 within Dhaka, ৳150 for other districts.</li>
                  <li>Above 4kg: ৳150 within Dhaka, ৳170 for other districts.</li>
                </ul>
              </li>
              <li>Delivery charges are clearly shown at checkout and added on top of the display price.</li>
              <li>After the admin approves an order, pickup is scheduled with Steadfast. Sellers must be available at the scheduled pickup time and hand over the book in the same condition as listed.</li>
              <li>Estimated delivery time depends on Steadfast’s service window (typically 1–5 business days). We do not guarantee a specific delivery date.</li>
              <li>Repeated seller no-shows during pickup will result in warnings, suspension, and eventual permanent ban.</li>
              <li>Buyers must be reachable on the phone number provided and accept delivery at the address provided. Failed delivery attempts caused by the buyer being unreachable or unavailable may be marked as unsuccessful.</li>
            </ul>
          </Section>

          <Section title="8. Cash on Delivery (COD) Payments">
            <ul className="list-disc space-y-1 pl-5">
              <li>The Platform operates strictly on a Cash on Delivery model. No advance payment, online payment, or card transaction is collected from the buyer at checkout.</li>
              <li>The buyer pays the full amount (display price + delivery charge) in cash to the Steadfast courier at the time of delivery.</li>
              <li>Steadfast remits the collected payment to Book Loop BD on its own settlement cycle. Book Loop BD then disburses the seller’s original asking price via bKash or Nagad, normally within 3–7 business days after receiving funds from the courier.</li>
              <li>Book Loop BD retains the 10% Platform Fee from the buyer’s payment.</li>
              <li>Delivery charges are passed through to the courier and are not part of the seller’s payout or the Platform Fee.</li>
            </ul>
          </Section>

          <Section title="9. Order Lifecycle">
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Pending</strong> — A buyer has placed an order. The listing remains visible to other users. The buyer may cancel during this stage only.</li>
              <li><strong>Approved</strong> — The admin reviews and approves the order. The listing is marked Currently Unavailable. Cancellation by the buyer is no longer possible.</li>
              <li><strong>In Transit</strong> — Steadfast has picked up the book and is delivering it to the buyer.</li>
              <li><strong>Delivered</strong> — The courier has handed over the book and collected payment. The listing is permanently removed (if stock is exhausted) and the seller payout is queued.</li>
              <li><strong>Unsuccessful</strong> — Delivery could not be completed. The listing is reverted to Available so other buyers can order it.</li>
            </ul>
          </Section>

          <Section title="10. Order Cancellation Policy">
            <ul className="list-disc space-y-1 pl-5">
              <li>Buyers may cancel an order only while it is in Pending status, before admin approval.</li>
              <li>Once an order is Approved by the admin, the buyer cannot cancel it through the Platform. Because the order is COD, no advance payment has been taken from the buyer, so this restriction does not cause any financial loss to the buyer.</li>
              <li>Repeatedly refusing approved deliveries without legitimate reason may result in the buyer being warned, suspended, or banned.</li>
              <li>Book Loop BD may cancel an order at any time if it is suspected of fraud, listing inaccuracy, prohibited content, or operational issues, with reasonable notice to both parties.</li>
            </ul>
          </Section>

          <Section title="11. No Refund Policy">
            <p>Because all transactions are completed in person via Cash on Delivery, buyers have the opportunity to inspect the book’s packaging at the moment of delivery and pay only if they accept it. As a result:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Once delivery is marked successful and the buyer has paid the courier, the sale is final and no refunds will be issued.</li>
              <li>If you believe there is a serious misrepresentation in the listing or a genuine quality issue with the delivered book, please contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> within 48 hours of delivery. We will attempt to mediate manually on a best-effort basis, but we cannot guarantee a financial remedy.</li>
              <li>We do not facilitate buyer-initiated returns, exchanges, or store credits.</li>
            </ul>
          </Section>

          <Section title="12. Disputes and Mediation">
            <p>Book Loop BD acts only as an intermediary platform. We do not physically inspect, verify, or guarantee the condition or authenticity of any book listed by sellers. All disputes between buyers and sellers are handled manually by the admin team on a case-by-case basis. By using the Platform, you agree that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>You will engage in good-faith communication with the admin team during any dispute.</li>
              <li>You will provide truthful evidence (photographs, screenshots, courier records) when requested.</li>
              <li>The admin’s decision after reviewing the available evidence is final.</li>
              <li>You will not initiate chargebacks, social-media attacks, or public defamation as a substitute for the dispute process.</li>
            </ul>
          </Section>

          <Section title="13. User Conduct and Prohibited Activities">
            <p>You agree that you will not use the Platform to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Post false, misleading, fraudulent, pirated, or counterfeit listings.</li>
              <li>List any item that is not a permitted school or college curriculum book (e.g., university books, foreign editions outside our supported curriculums, novels, gadgets, accessories, or any non-book item).</li>
              <li>Harass, abuse, threaten, defame, or otherwise harm other users, admins, or couriers.</li>
              <li>Solicit other users to transact outside the Platform to avoid fees, taxes, or accountability.</li>
              <li>Create multiple accounts, impersonate another person, or use bots, scrapers, or automated tools to access the Platform.</li>
              <li>Upload viruses, malware, or any code intended to disrupt the Platform.</li>
              <li>Reverse-engineer, decompile, or attempt to extract the Platform’s source code or underlying database.</li>
              <li>Violate any applicable law, regulation, or third-party right (including intellectual-property rights).</li>
              <li>Use the Platform to launder money, finance illegal activity, or transmit prohibited content.</li>
            </ul>
            <p className="mt-2">Violations may result in immediate listing removal, account suspension, permanent ban, and (where applicable) referral to law-enforcement authorities.</p>
          </Section>

          <Section title="14. Intellectual Property">
            <ul className="list-disc space-y-1 pl-5">
              <li>The Book Loop BD name, logo, website design, layouts, illustrations, code, copy, and other original content are the intellectual property of Book Loop BD and are protected by applicable copyright and trademark laws.</li>
              <li>You may not copy, reproduce, distribute, modify, or create derivative works of any Platform content without our prior written consent.</li>
              <li>By uploading listing photos and descriptions, you grant Book Loop BD a non-exclusive, royalty-free, worldwide license to host, display, reproduce, and distribute that content for the purposes of operating, promoting, and improving the Platform.</li>
              <li>You retain ownership of the content you upload but represent that you have all necessary rights to grant the license above.</li>
            </ul>
          </Section>

          <Section title="15. User-Generated Content">
            <p>You are solely responsible for the listings, photos, messages, and any other content you submit on the Platform. We do not pre-screen every piece of content but reserve the right to review, edit, refuse, or remove any content at our discretion. You agree that any content you submit:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Is accurate and not misleading.</li>
              <li>Does not infringe any third party’s rights.</li>
              <li>Is not obscene, defamatory, hateful, harassing, or otherwise objectionable.</li>
              <li>Does not contain personal contact information that bypasses the Platform.</li>
            </ul>
          </Section>

          <Section title="16. Privacy">
            <p>Your use of the Platform is also governed by our <Link to="/privacy-policy" className="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</Link>, which explains how we collect, use, protect, and share your personal information. By using the Platform, you consent to the practices described in the Privacy Policy.</p>
          </Section>

          <Section title="17. Service Availability and Modifications">
            <ul className="list-disc space-y-1 pl-5">
              <li>We strive to keep the Platform available 24/7 but do not guarantee uninterrupted access. Scheduled maintenance, technical failures, or third-party outages (such as Supabase, Vercel, Resend, or Steadfast disruptions) may temporarily affect availability.</li>
              <li>We may add, modify, suspend, or discontinue any feature, listing category, payment method, or service at any time without prior notice and without liability.</li>
              <li>We are not responsible for losses caused by service interruptions outside our reasonable control, including force majeure events such as natural disasters, network outages, or government action.</li>
            </ul>
          </Section>

          <Section title="18. Disclaimers">
            <p>The Platform is provided on an “as is” and “as available” basis. To the maximum extent permitted by applicable law, Book Loop BD disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Listings will be free from inaccuracies or errors.</li>
              <li>Books delivered will always meet your subjective expectations.</li>
              <li>The Platform will operate uninterrupted, secure, or error-free at all times.</li>
              <li>Any specific result will be achieved through your use of the Platform.</li>
            </ul>
          </Section>

          <Section title="19. Limitation of Liability">
            <p>To the maximum extent permitted by law:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Book Loop BD shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including loss of profits, revenue, goodwill, data, or opportunity, arising from or related to your use of the Platform.</li>
              <li>Our total aggregate liability to any user for any claim arising out of or related to a particular transaction shall not exceed the Platform Fee that Book Loop BD actually collected on that specific transaction.</li>
              <li>We are not liable for the acts or omissions of other users, third-party service providers (including Steadfast Courier), or external infrastructure providers.</li>
            </ul>
          </Section>

          <Section title="20. Indemnification">
            <p>You agree to indemnify, defend, and hold harmless Book Loop BD, its admins, employees, contractors, and partners from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from or related to (a) your use of the Platform, (b) your listings or any content you submit, (c) your breach of these Terms or applicable law, or (d) your violation of any third-party right, including intellectual-property or privacy rights.</p>
          </Section>

          <Section title="21. Suspension and Termination">
            <ul className="list-disc space-y-1 pl-5">
              <li>We may suspend or permanently terminate your account at any time, with or without notice, for any breach of these Terms, suspected fraud, abuse, or behaviour that endangers the integrity or reputation of the Platform.</li>
              <li>You may stop using the Platform and request account deletion at any time by contacting us.</li>
              <li>Termination does not relieve you of liability for transactions already completed, fees already incurred, or content already submitted.</li>
              <li>Sections that by their nature should survive termination — including intellectual-property, disclaimers, limitation of liability, indemnification, and governing law — shall remain in effect.</li>
            </ul>
          </Section>

          <Section title="22. Communications">
            <p>By creating an account, you consent to receive transactional emails and notifications related to your activity on the Platform. These include listing approvals, expiry warnings, order updates, pickup and delivery notifications, payout confirmations, and account or security alerts. We do not currently send marketing emails. You acknowledge that transactional emails are an essential part of the service and cannot be opted out of without deactivating your account.</p>
          </Section>

          <Section title="23. Force Majeure">
            <p>Book Loop BD shall not be liable for any failure or delay in performing its obligations under these Terms where such failure or delay is caused by events beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics, strikes, riots, war, terrorism, government action, internet or telecommunication failures, or failures of third-party logistics or infrastructure providers.</p>
          </Section>

          <Section title="24. Changes to These Terms">
            <p>We may update these Terms from time to time to reflect changes in our practices, technology, services, or legal environment. When we do, we will revise the “Last Updated” date at the top of this page. For material changes, we will take reasonable steps to notify users, such as posting a notice on the Platform or sending an email. Your continued use of the Platform after such updates constitutes acceptance of the revised Terms.</p>
          </Section>

          <Section title="25. Severability">
            <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be interpreted, to the extent possible, to reflect the original intent of the parties.</p>
          </Section>

          <Section title="26. Entire Agreement">
            <p>These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and Book Loop BD regarding your use of the Platform and supersede all prior or contemporaneous agreements, understandings, or communications, whether written or oral.</p>
          </Section>

          <Section title="27. Assignment">
            <p>You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign our rights and obligations under these Terms to any successor in interest, including in connection with a merger, acquisition, or sale of assets.</p>
          </Section>

          <Section title="28. Governing Law and Jurisdiction">
            <p>These Terms are governed by and construed in accordance with the laws of the People’s Republic of Bangladesh. Any dispute arising out of or in connection with these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the competent courts of Bangladesh.</p>
          </Section>

          <Section title="29. Contact Us" last>
            <p>If you have any questions, concerns, or feedback about these Terms and Conditions, please contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> or email us at <a href="mailto:bookloopbd.com@gmail.com" className="text-primary underline underline-offset-2 hover:opacity-80">bookloopbd.com@gmail.com</a>. We aim to respond to all genuine inquiries within a reasonable time frame.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Section = ({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) => (
  <section className={last ? '' : 'mb-8'}>
    <h2 className="mb-3 text-lg font-semibold text-primary">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-[hsl(var(--body))]">{children}</div>
  </section>
);

export default Terms;
