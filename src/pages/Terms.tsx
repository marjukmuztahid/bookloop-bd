import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const Terms = () => {
  useSEO({ title: 'Terms & Conditions — Book Loop BD', description: 'Marketplace rules, seller and buyer obligations, and platform policies for Book Loop BD.', canonicalPath: '/terms' });

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
          <p className="mb-8 text-sm text-muted-foreground">Effective Date: January 1, 2026</p>

          <Section title="1. About Book Loop BD">
            <p>Book Loop BD is an online marketplace where students in Bangladesh can buy and sell second-hand school and college books. By creating an account or using this platform, you agree to these Terms and Conditions. Please read them carefully.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>Book Loop BD is intended for school and college students in Bangladesh. By registering, you confirm that you are a student or the parent/guardian of a student using the platform on their behalf. We currently do not serve university-level curriculum books.</p>
          </Section>

          <Section title="3. Accounts">
            <ul className="list-disc space-y-1 pl-5">
              <li>Every registered user has a single unified account that allows both buying and selling</li>
              <li>You are responsible for keeping your account credentials secure</li>
              <li>You must provide accurate information during registration including your real name, phone number, and district</li>
              <li>Sellers must add their bKash or Nagad number in profile settings before posting a listing</li>
              <li>We reserve the right to suspend or permanently ban accounts that violate these terms</li>
            </ul>
          </Section>

          <Section title="4. Listing Rules for Sellers">
            <p>By posting a listing on Book Loop BD, you agree to the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>The book you are listing must be in your possession and available for sale</li>
              <li>All listing information must be accurate including book name, author, curriculum type, class, condition, weight, and photos</li>
              <li>You may upload a maximum of 3 photos per listing</li>
              <li>You must not post duplicate listings of the same book</li>
              <li>You must honestly represent the condition of the book (New, Good, Fair, or Worn)</li>
              <li>Listings that are found to be misleading or fraudulent will be rejected or removed by admin without notice</li>
              <li>Approved listings that remain unsold will be automatically removed after 60 days. You will receive a warning email 7 days before removal</li>
              <li>Book Loop BD admin reserves the right to remove any approved listing at any time with notification to the seller</li>
            </ul>
          </Section>

          <Section title="5. Platform Fee">
            <p>Book Loop BD charges a flat 10% platform fee on every successful sale. This fee is automatically added on top of your asking price in the buyer-facing displayed price — you enter your desired selling price and the platform adds 10% on top for the buyer. When your sale is completed and delivery is confirmed, you will receive your original asking price via bKash or Nagad.</p>
          </Section>

          <Section title="6. Delivery and Courier">
            <ul className="list-disc space-y-1 pl-5">
              <li>All deliveries are handled by Steadfast Courier</li>
              <li>Delivery charges are calculated based on the weight of the book and the districts of the seller and buyer</li>
              <li>Under 2kg: ৳90 within Dhaka, ৳120 for other districts</li>
              <li>2kg to 4kg: ৳110 within Dhaka, ৳150 for other districts</li>
              <li>Above 4kg: ৳150 within Dhaka, ৳170 for other districts</li>
              <li>Delivery charges are added on top of the book price and shown clearly at checkout</li>
              <li>Book Loop BD admin coordinates the pickup schedule with Steadfast after approving an order</li>
              <li>Sellers must be available and cooperative during the scheduled pickup window. Repeated no-shows will result in a warning and may lead to account suspension</li>
            </ul>
          </Section>

          <Section title="7. Cash on Delivery (COD)">
            <ul className="list-disc space-y-1 pl-5">
              <li>Book Loop BD operates on a Cash on Delivery model only</li>
              <li>Buyers pay the full amount in cash directly to the Steadfast courier at the time of delivery</li>
              <li>No advance payment or online payment is required from the buyer at any point</li>
              <li>Steadfast collects the payment and remits it to Book Loop BD, after which the seller is paid their original asking price via bKash or Nagad (the 10% platform fee is retained by Book Loop BD)</li>
            </ul>
          </Section>

          <Section title="8. Order Process">
            <ul className="list-disc space-y-1 pl-5">
              <li>After a buyer places an order it remains in Pending status until the admin reviews and approves it</li>
              <li>A listing remains visible to other users until the admin approves the order</li>
              <li>Once the order is approved the listing is marked as Currently Unavailable</li>
              <li>If the delivery is successful the listing is permanently removed</li>
              <li>If the delivery is unsuccessful the listing is reverted to Available status so other buyers can order it</li>
            </ul>
          </Section>

          <Section title="9. Order Cancellation">
            <ul className="list-disc space-y-1 pl-5">
              <li>Buyers may cancel their order only before the admin approves it</li>
              <li>Once the admin has approved the order, cancellation is no longer possible</li>
              <li>Since Book Loop BD uses COD, buyers are never charged in advance, so there is no financial risk to the buyer from an approved order</li>
            </ul>
          </Section>

          <Section title="10. No Refund Policy">
            <p>Because all transactions are Cash on Delivery, buyers pay only upon receiving the book in person. We do not offer refunds after a delivery has been marked as successful. If you believe there is a serious issue with a delivered book, please contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> and we will attempt to mediate manually.</p>
          </Section>

          <Section title="11. Disputes">
            <p>Book Loop BD does not guarantee the condition or authenticity of any book listed on the platform. All disputes between buyers and sellers are handled manually by the admin team on a case by case basis. We will do our best to mediate fairly but our decision is final. For disputes, contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> or email us directly.</p>
          </Section>

          <Section title="12. Prohibited Conduct">
            <p>You must not use Book Loop BD to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Post false, misleading, or fraudulent listings</li>
              <li>Harass, deceive, or harm other users</li>
              <li>List items other than school or college books</li>
              <li>Create multiple accounts to manipulate the platform</li>
              <li>Attempt to conduct transactions outside the platform to avoid the platform fee</li>
            </ul>
            <p className="mt-2">Violations may result in immediate account suspension or permanent ban.</p>
          </Section>

          <Section title="13. Limitation of Liability">
            <p>Book Loop BD is a marketplace platform that facilitates transactions between buyers and sellers. We are not responsible for the physical condition of books beyond what is described in the listing, any delays caused by Steadfast Courier, or any losses arising from disputes between users. Our liability is limited to the platform fee collected on any given transaction.</p>
          </Section>

          <Section title="14. Changes to These Terms">
            <p>We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of Book Loop BD after changes are posted means you accept the revised terms.</p>
          </Section>

          <Section title="15. Governing Law">
            <p>These terms are governed by the laws of Bangladesh. Any disputes arising from the use of this platform shall be subject to the jurisdiction of the courts of Bangladesh.</p>
          </Section>

          <Section title="16. Contact Us" last>
            <p>If you have any questions about these Terms and Conditions, please reach out through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> on our website or email us directly.</p>
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
