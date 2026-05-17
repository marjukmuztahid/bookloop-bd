import { Mail, MessageSquare, AlertTriangle, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const Contact = () => {
  useSEO({ title: 'Contact Book Loop BD — Support for BD Book Marketplace', description: 'Get support for buying or selling second-hand books on Book Loop BD. Reach our team by email or WhatsApp.', canonicalPath: '/contact' });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16">
        <h1 className="mb-2 text-2xl font-bold text-[#1A1A1A]">Contact / Report an Issue</h1>
        <p className="mb-8 text-sm text-[#8A8A8A]">
          Have a question, feedback, or need to report a problem? Reach out to us and we'll get back to you as soon as possible.
        </p>

        <div className="glass-panel space-y-6 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(232,53,122,0.10)]">
              <Mail size={20} className="text-[#E8357A]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Email Us</h2>
              <p className="mt-1 text-sm text-[#8A8A8A]">
                For any inquiries or issues, send us an email at:
              </p>
              <a
                href="mailto:bookloopbd.com@gmail.com"
                className="mt-2 inline-block text-sm font-medium text-[#E8357A] transition-colors hover:text-[#c42a65]"
              >
                bookloopbd.com@gmail.com
              </a>
            </div>
          </div>

          <div className="h-px bg-[rgba(0,0,0,0.06)]" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(37,211,102,0.10)]">
              <Phone size={20} className="text-[#25D366]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">WhatsApp</h2>
              <p className="mt-1 text-sm text-[#8A8A8A]">
                Chat with us directly on WhatsApp for quick support:
              </p>
              <a
                href="https://wa.me/8801743661887"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-[#25D366] transition-colors hover:text-[#1da851]"
              >
                +8801743-661887
              </a>
            </div>
          </div>

          <div className="h-px bg-[rgba(0,0,0,0.06)]" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(232,53,122,0.10)]">
              <MessageSquare size={20} className="text-[#E8357A]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">General Inquiries</h2>
              <p className="mt-1 text-sm text-[#8A8A8A]">
                Questions about buying, selling, or how Book Loop BD works? We're happy to help.
              </p>
            </div>
          </div>

          <div className="h-px bg-[rgba(0,0,0,0.06)]" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(232,53,122,0.10)]">
              <AlertTriangle size={20} className="text-[#E8357A]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Report a Problem</h2>
              <p className="mt-1 text-sm text-[#8A8A8A]">
                Found a bug, suspicious listing, or have a complaint? Email us with details and we'll investigate promptly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
