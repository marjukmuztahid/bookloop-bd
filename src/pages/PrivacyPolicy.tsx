import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const PrivacyPolicy = () => {
  useSEO({ title: 'Privacy Policy — Book Loop BD', description: 'How Book Loop BD collects, stores, protects, and uses your personal data on Bangladesh\'s second-hand school book marketplace.', canonicalPath: '/privacy-policy' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <div className="glass-panel p-6 sm:p-10">
          <h1 className="mb-2 text-2xl font-bold text-primary sm:text-3xl">PRIVACY POLICY</h1>
          <p className="mb-8 text-sm text-muted-foreground">Effective Date: January 1, 2026 &nbsp;·&nbsp; Last Updated: January 1, 2026</p>

          <Section title="1. Introduction and Scope">
            <p>Book Loop BD (“we”, “us”, “our”, or the “Platform”) is a second-hand book marketplace operated from Bangladesh that connects school and college students who wish to buy and sell used curriculum books. We take the privacy of our users (“you”, “user”, “buyer”, or “seller”) seriously and are committed to handling your personal data lawfully, fairly, and transparently.</p>
            <p>This Privacy Policy explains what information we collect, why we collect it, how we use and protect it, with whom we share it, and what rights and choices you have. It applies to all visitors and registered users of the Book Loop BD website, mobile-responsive pages, transactional emails, and any related services we provide (collectively, the “Services”).</p>
            <p>By creating an account, browsing listings, placing an order, or otherwise using the Services, you acknowledge that you have read and understood this Privacy Policy and consent to the practices described here. If you do not agree with any part of this Policy, please do not use the Platform.</p>
          </Section>

          <Section title="2. Who We Are and How to Contact Us">
            <p>Book Loop BD is an online-only platform operated by an independent team based in Bangladesh. We act as the data controller for the personal data described in this Policy. You can contact us at any time through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> or by email at <a href="mailto:bookloopbd.com@gmail.com" className="text-primary underline underline-offset-2 hover:opacity-80">bookloopbd.com@gmail.com</a> for any privacy-related questions, requests, or complaints.</p>
          </Section>

          <Section title="3. Information We Collect">
            <p>We only collect information that is necessary to operate the marketplace, process orders, and improve your experience. The categories of personal data we collect are:</p>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.1 Information You Provide During Sign-Up</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Full name</li>
              <li>Email address (used as your login identifier and for notifications)</li>
              <li>Password (stored in encrypted/hashed form — never visible to us)</li>
              <li>Phone number</li>
              <li>District (selected from the 64 districts of Bangladesh)</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.2 Seller Profile Information</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>bKash or Nagad number (mandatory before posting a listing, used solely for payouts)</li>
              <li>Pickup address (used for courier pickup coordination)</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.3 Listing Information</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Book name, author, curriculum, class, condition, weight, stock quantity, and asking price</li>
              <li>Up to three (3) photographs of the book you upload</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.4 Buyer Order Information</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Delivery address (street, area, district, postcode where applicable)</li>
              <li>Contact phone number for the courier</li>
              <li>Order history, status, and any cancellation reasons</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.5 Technical and Usage Data</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>IP address, device type, browser, operating system, and approximate location derived from your IP</li>
              <li>Pages visited, listings viewed, search queries, referring URL, and timestamps</li>
              <li>Basic diagnostic logs collected to identify and fix errors</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-foreground">3.6 Communications</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Messages, complaints, or support tickets you send us through the Contact page, email, or WhatsApp</li>
              <li>Records of transactional emails we send you (for example, delivery receipts and audit trails)</li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Information">
            <p>We process the personal data described above for the following purposes only:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Account management</strong> — creating and securing your account, authenticating logins, and allowing password resets.</li>
              <li><strong>Marketplace operations</strong> — publishing your listings, displaying limited public information (first name and district) on listing pages, and matching buyers with sellers.</li>
              <li><strong>Order processing</strong> — reviewing, approving, and tracking orders through the buyer-pending, seller-pickup, in-transit, delivered, and returned stages.</li>
              <li><strong>Transactional notifications</strong> — sending essential service emails such as listing approvals, expiry warnings, order confirmations, pickup schedules, delivery status, and seller payout confirmations through our email provider Resend.</li>
              <li><strong>Payments and payouts</strong> — sharing seller payout details with our finance workflow to transfer funds via bKash or Nagad after a successful Cash on Delivery transaction.</li>
              <li><strong>Delivery</strong> — sharing the buyer’s delivery address and phone number, along with the seller’s pickup address and phone number, with Steadfast Courier purely for completing the delivery.</li>
              <li><strong>Customer support and dispute resolution</strong> — responding to your inquiries and mediating between buyers and sellers when issues arise.</li>
              <li><strong>Fraud prevention and security</strong> — detecting and preventing fraudulent listings, fake accounts, abuse, scams, and violations of our Terms.</li>
              <li><strong>Platform improvement</strong> — analysing aggregate usage data to improve performance, fix bugs, and design new features.</li>
              <li><strong>Legal compliance</strong> — meeting applicable legal obligations under the laws of Bangladesh and responding to lawful requests from authorities.</li>
            </ul>
          </Section>

          <Section title="5. Legal Bases for Processing">
            <p>We rely on the following legal bases to process your personal data:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Performance of a contract</strong> — to fulfil our obligations to you when you place or receive an order.</li>
              <li><strong>Consent</strong> — given when you create an account and voluntarily submit your information.</li>
              <li><strong>Legitimate interests</strong> — to keep the Platform safe, prevent fraud, and improve our Services.</li>
              <li><strong>Legal obligation</strong> — where we must process data to comply with the laws of Bangladesh.</li>
            </ul>
          </Section>

          <Section title="6. Who We Share Your Information With">
            <p>We do not sell, rent, or trade your personal data. We share information only with the limited parties listed below, and only to the extent required for the Services to function:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Other users</strong> — your first name, district, and listing content are publicly visible on listing pages so buyers can make informed decisions. Your phone number, email, bKash/Nagad number, and home address are never shown publicly.</li>
              <li><strong>Steadfast Courier (delivery partner)</strong> — receives the seller’s pickup details and the buyer’s delivery details (name, address, phone) solely for completing the delivery.</li>
              <li><strong>Resend (email service provider)</strong> — processes your email address and the content of transactional emails on our behalf.</li>
              <li><strong>Supabase (backend infrastructure provider)</strong> — provides the secure database, authentication, and file storage that powers the Platform.</li>
              <li><strong>Vercel (hosting provider)</strong> — hosts the website and routes web traffic.</li>
              <li><strong>Book Loop BD admin team</strong> — authorised admins can access account and order data to review listings, approve orders, resolve disputes, and process payouts.</li>
              <li><strong>Legal and regulatory authorities</strong> — where required by law, court order, or to protect our rights, property, or the safety of users.</li>
              <li><strong>Successors in interest</strong> — in the unlikely event of a merger, acquisition, or sale of assets, relevant data may be transferred to the acquiring entity under equivalent privacy commitments.</li>
            </ul>
            <p className="mt-2">All third-party service providers are required to keep your information confidential and use it only for the specific purpose for which it was shared.</p>
          </Section>

          <Section title="7. International Data Transfers">
            <p>Some of our service providers (such as Supabase, Vercel, and Resend) operate data centres outside Bangladesh. When personal data is transferred internationally, we rely on the contractual safeguards offered by these providers and ensure they apply industry-standard security measures comparable to those expected in Bangladesh.</p>
          </Section>

          <Section title="8. Cookies and Similar Technologies">
            <p>We use a minimal number of cookies and similar technologies to operate the Platform. These include:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Essential cookies</strong> — required to keep you logged in, remember your cart, and operate core features.</li>
              <li><strong>Functional storage</strong> — small pieces of information stored in your browser (such as localStorage) used to remember preferences like dismissed onboarding modals.</li>
              <li><strong>Analytics signals</strong> — basic logs that help us measure traffic and detect errors. We do not run third-party advertising trackers.</li>
            </ul>
            <p className="mt-2">You can clear cookies and local storage at any time from your browser settings. Disabling essential cookies may prevent you from logging in or using parts of the Platform.</p>
          </Section>

          <Section title="9. Data Retention">
            <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, including legal, accounting, or reporting requirements. Specifically:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Account data</strong> — retained while your account is active. You may request deletion at any time.</li>
              <li><strong>Active listings</strong> — automatically removed after a successful delivery or after 60 days of remaining unsold. A reminder email is sent 7 days before automatic expiry.</li>
              <li><strong>Order records</strong> — basic transactional records (order IDs, timestamps, amounts, status) are retained permanently for accounting, dispute resolution, and fraud prevention.</li>
              <li><strong>Email logs</strong> — retained for a limited period for audit and troubleshooting purposes.</li>
              <li><strong>Banned or suspended accounts</strong> — identifying details may be retained indefinitely to prevent repeat offenders from re-registering.</li>
            </ul>
          </Section>

          <Section title="10. Your Rights and Choices">
            <p>Subject to applicable law, you have the following rights regarding your personal data:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
              <li><strong>Correction</strong> — update inaccurate or incomplete information directly from your profile settings or by contacting us.</li>
              <li><strong>Deletion</strong> — request that we delete your account and associated personal data, subject to records we must keep for legal or dispute-resolution reasons.</li>
              <li><strong>Restriction or objection</strong> — ask us to limit or stop processing your data in certain circumstances.</li>
              <li><strong>Withdraw consent</strong> — withdraw any consent you previously gave, without affecting the lawfulness of past processing.</li>
              <li><strong>Complain</strong> — raise a concern with us, or with the relevant data-protection authority in Bangladesh.</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please email us at <a href="mailto:bookloopbd.com@gmail.com" className="text-primary underline underline-offset-2 hover:opacity-80">bookloopbd.com@gmail.com</a>. We will respond within a reasonable time frame, normally within 30 days.</p>
          </Section>

          <Section title="11. Data Security">
            <p>We implement appropriate technical and organisational measures designed to protect your personal data from unauthorised access, alteration, disclosure, or destruction. These measures include:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>HTTPS/TLS encryption for all traffic between your device and our servers</li>
              <li>Database-level Row Level Security (RLS) so users can only access their own data</li>
              <li>Server-side validation via security-definer functions for sensitive operations</li>
              <li>Hashed passwords with industry-standard cryptography — we never store passwords in plain text</li>
              <li>Restricted admin access protected by separate authentication and session expiry</li>
              <li>Protection against compromised passwords using HaveIBeenPwned integration</li>
              <li>Regular monitoring of logs and security advisories</li>
            </ul>
            <p className="mt-2">Despite these measures, no method of transmission over the internet or method of electronic storage is 100% secure. You are responsible for keeping your account credentials confidential and notifying us immediately if you suspect unauthorised use of your account.</p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>Book Loop BD is designed for school and college students in Bangladesh and assumes that minors will use the Platform with the consent and supervision of a parent or legal guardian. We do not knowingly collect personal information from children under the age of 13 without parental consent. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us and we will promptly delete the relevant data.</p>
          </Section>

          <Section title="13. Third-Party Links">
            <p>Book Loop BD may occasionally include links to external websites such as social media pages, blog references, or partner sites. We are not responsible for the privacy practices or content of those third-party sites. We encourage you to review their privacy policies before providing any personal information.</p>
          </Section>

          <Section title="14. Marketing Communications">
            <p>At present, we send only transactional emails strictly related to your account and orders. We do not run promotional email campaigns. If this changes in the future, we will obtain your explicit consent before sending any marketing communications and will provide a clear opt-out mechanism in every email.</p>
          </Section>

          <Section title="15. Account Deletion">
            <p>You may request deletion of your account at any time by contacting us. Upon a valid deletion request, we will remove your profile data, contact information, and personally identifiable details from active systems. Certain records — including completed order history, payouts, and dispute records — may be retained as anonymised or pseudonymised data for accounting and legal compliance.</p>
          </Section>

          <Section title="16. Data Breach Notification">
            <p>In the unlikely event of a personal data breach that is likely to result in a high risk to your rights and freedoms, we will notify affected users without undue delay and take all reasonable steps to mitigate the impact. Where required by law, we will also notify the relevant authorities.</p>
          </Section>

          <Section title="17. Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or service offerings. When we do, we will revise the “Last Updated” date at the top of this page. For material changes, we will take reasonable steps to notify you, such as posting a notice on the Platform or sending an email. Your continued use of the Platform after such updates constitutes acceptance of the revised Policy.</p>
          </Section>

          <Section title="18. Governing Law">
            <p>This Privacy Policy is governed by the laws of the People’s Republic of Bangladesh. Any disputes relating to this Policy will be subject to the exclusive jurisdiction of the competent courts of Bangladesh.</p>
          </Section>

          <Section title="19. Contact Us" last>
            <p>If you have any questions, concerns, requests, or complaints about this Privacy Policy or our handling of your personal data, please contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> or email us at <a href="mailto:bookloopbd.com@gmail.com" className="text-primary underline underline-offset-2 hover:opacity-80">bookloopbd.com@gmail.com</a>. We are committed to resolving any issue fairly and promptly.</p>
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

export default PrivacyPolicy;
