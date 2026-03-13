import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const PrivacyPolicy = () => {
  useSEO({ title: 'Privacy Policy — Book Loop BD', description: 'Read the privacy policy of Book Loop BD, Bangladesh's student book marketplace.' });

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
          <p className="mb-8 text-sm text-muted-foreground">Effective Date: January 1, 2026</p>

          <Section title="1. Introduction">
            <p>Book Loop BD is a second-hand book marketplace connecting students across Bangladesh. We are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information.</p>
          </Section>

          <Section title="2. What Information We Collect">
            <p>When you create an account or use our platform, we collect the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>District (location)</li>
              <li>bKash or Nagad number (sellers only, added voluntarily in profile settings)</li>
              <li>Delivery address (buyers only, collected at checkout)</li>
              <li>Book listing details including photos, descriptions, and pricing</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information solely to operate the platform:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To create and manage your account</li>
              <li>To process and fulfill orders</li>
              <li>To send transactional email notifications (listing approvals, order updates, delivery status) via Resend</li>
              <li>To facilitate seller payouts via bKash or Nagad</li>
              <li>To share necessary delivery details with our courier partner, Steadfast Courier</li>
              <li>To resolve disputes manually when raised by users</li>
            </ul>
          </Section>

          <Section title="4. Who Can See Your Information">
            <ul className="list-disc space-y-1 pl-5">
              <li>The Book Loop BD admin team can access all account and order information for operational purposes</li>
              <li>Steadfast Courier receives only the buyer's delivery address and phone number for delivery purposes</li>
              <li>Other users on the platform can only see your first name and district on book listings — your phone number, email, and payment details are never publicly visible</li>
            </ul>
          </Section>

          <Section title="5. What We Do Not Do">
            <ul className="list-disc space-y-1 pl-5">
              <li>We do not sell your personal data to any third party</li>
              <li>We do not use your data for advertising purposes</li>
              <li>We do not share your bKash or Nagad number with anyone other than for processing your payout</li>
            </ul>
          </Section>

          <Section title="6. Email Notifications">
            <p>We send transactional emails related to your activity on the platform such as listing approvals, order confirmations, pickup schedules, and delivery updates. These are essential service emails. If you wish to stop receiving them, you may contact us to deactivate your account.</p>
          </Section>

          <Section title="7. Data Retention">
            <ul className="list-disc space-y-1 pl-5">
              <li>Active listings are deleted after successful delivery or after 60 days of inactivity</li>
              <li>Basic order records are retained permanently for dispute resolution purposes</li>
              <li>If you delete your account, your personal profile data will be removed. Order records may still be retained for administrative purposes</li>
            </ul>
          </Section>

          <Section title="8. Security">
            <p>We take reasonable steps to protect your information. Your account is password protected and sensitive payment details such as bKash and Nagad numbers are only accessible to the admin team.</p>
          </Section>

          <Section title="9. Children and Minors">
            <p>Book Loop BD is designed for school and college students. If you are under 13, please use this platform only with the knowledge of a parent or guardian.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the platform means you accept the updated policy.</p>
          </Section>

          <Section title="11. Contact Us" last>
            <p>If you have any questions or concerns about your privacy, please contact us through the <Link to="/contact" className="text-primary underline underline-offset-2 hover:opacity-80">Contact page</Link> on our website or email us directly.</p>
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
