import { Mail, MessageSquare, AlertTriangle, Phone, Clock, Calendar, Languages, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const FAQ_ITEMS = [
  'How do I sell a book?',
  'How does delivery work?',
  'When will I get paid?',
  "What if my order doesn't arrive?",
  'Can I cancel an order?',
];

const Contact = () => {
  useSEO({
    title: 'Contact Book Loop BD — Support for BD Book Marketplace',
    description:
      'Get support for buying or selling second-hand books on Book Loop BD. Reach our team by email, phone, WhatsApp, or social media.',
    canonicalPath: '/contact',
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <h1 className="mb-2 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">
            Contact / Report an Issue
          </h1>
          <p className="mb-8 text-sm text-[#8A8A8A]">
            Reach out by email, phone, WhatsApp, or social — we're happy to help with buying, selling, or any issue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT — Contact Methods */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.05 }}
            className="glass-panel space-y-6 p-6"
            aria-label="Contact methods"
          >
            <ContactRow
              icon={<Mail size={20} className="text-[#E8357A]" />}
              iconBg="bg-[rgba(232,53,122,0.10)]"
              title="Email Us"
              description="For any inquiries or issues, send us an email at:"
            >
              <a
                href="mailto:bookloopbd.com@gmail.com"
                className="mt-2 inline-block text-sm font-medium text-[#E8357A] transition-colors hover:text-[#c42a65]"
              >
                bookloopbd.com@gmail.com
              </a>
            </ContactRow>

            <Divider />

            <ContactRow
              icon={<MessageSquare size={20} className="text-[#25D366]" />}
              iconBg="bg-[rgba(37,211,102,0.10)]"
              title="WhatsApp"
              description="Chat with us directly on WhatsApp for quick support:"
            >
              <a
                href="https://wa.me/8801743661887"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-[#25D366] transition-colors hover:text-[#1da851]"
              >
                +8801743-661887
              </a>
            </ContactRow>

            <Divider />

            <ContactRow
              icon={<Phone size={20} className="text-[#2563EB]" />}
              iconBg="bg-[rgba(37,99,235,0.10)]"
              title="Contact Number"
              description="Reach us by phone for general inquiries:"
            >
              <a
                href="tel:+8809647241356"
                className="mt-2 inline-block text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1e40af]"
              >
                +8809647-241356
              </a>
            </ContactRow>

            <Divider />

            <ContactRow
              icon={<AlertTriangle size={20} className="text-[#E8357A]" />}
              iconBg="bg-[rgba(232,53,122,0.10)]"
              title="Report a Problem"
              description="Found a bug, suspicious listing, or have a complaint? Email us with details and we'll investigate promptly."
            />
          </motion.section>

          {/* RIGHT — Business Info + Social */}
          <div className="flex flex-col gap-6">
            <motion.section
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="glass-panel space-y-5 p-6"
              aria-label="Business information"
            >
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Good to know</h2>
              <InfoRow
                icon={<Clock size={18} className="text-[#E8357A]" />}
                label="Response time"
                value="Usually within 24 hours"
              />
              <InfoRow
                icon={<Calendar size={18} className="text-[#E8357A]" />}
                label="Support hours"
                value="Saturday – Thursday, 10 AM – 8 PM (BST)"
              />
              <InfoRow
                icon={<Languages size={18} className="text-[#E8357A]" />}
                label="Languages"
                value="Bangla & English"
              />
            </motion.section>

            <motion.section
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: 0.15 }}
              className="glass-panel space-y-4 p-6"
              aria-label="Follow us on social media"
            >
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Follow us</h2>
              <p className="text-sm text-[#8A8A8A]">
                Stay updated with new listings, tips, and announcements.
              </p>
              <div className="flex items-center gap-3">
                <SocialIcon
                  href="https://www.facebook.com/share/17HMqPLb1L/"
                  label="Facebook"
                  hoverColor="hover:text-[#1877F2]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href="https://www.instagram.com/book_loop_bd?igsh=eW9"
                  label="Instagram"
                  hoverColor="hover:text-[#E1306C]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href="https://wa.me/8801743661887"
                  label="WhatsApp"
                  hoverColor="hover:text-[#25D366]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </SocialIcon>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Quick Help — full width below */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="glass-panel mt-6 p-6"
          aria-label="Quick help"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(232,53,122,0.10)]">
              <HelpCircle size={18} className="text-[#E8357A]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Quick Help</h2>
              <p className="text-xs text-[#8A8A8A]">Answers in seconds — check the FAQ first.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FAQ_ITEMS.map((q) => (
              <Link
                key={q}
                to="/faq"
                className="group flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.06)] bg-white/60 px-4 py-3 text-sm text-[#1A1A1A] transition-all hover:-translate-y-0.5 hover:border-[rgba(232,53,122,0.25)] hover:bg-white hover:shadow-sm"
              >
                <span>{q}</span>
                <ArrowRight
                  size={16}
                  className="text-[#8A8A8A] transition-all group-hover:translate-x-0.5 group-hover:text-[#E8357A]"
                />
              </Link>
            ))}
            <Link
              to="/faq"
              className="group flex items-center justify-between rounded-xl bg-[#E8357A] px-4 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#c42a65] hover:shadow-md sm:col-span-2"
            >
              <span>Browse all FAQs</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

/* ---------- helpers ---------- */

const Divider = () => <div className="h-px bg-[rgba(0,0,0,0.06)]" />;

const ContactRow = ({
  icon,
  iconBg,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-[#1A1A1A]">{title}</h3>
      <p className="mt-1 text-sm text-[#8A8A8A]">{description}</p>
      {children}
    </div>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(232,53,122,0.08)]">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#8A8A8A]">{label}</p>
      <p className="mt-0.5 text-sm text-[#1A1A1A]">{value}</p>
    </div>
  </div>
);

const SocialIcon = ({
  href,
  label,
  hoverColor,
  children,
}: {
  href: string;
  label: string;
  hoverColor: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.06)] bg-white/60 text-[#8A8A8A] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${hoverColor}`}
  >
    {children}
  </a>
);

export default Contact;
