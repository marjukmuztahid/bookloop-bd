import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs: { q: string; a: string }[] = [
  {
    q: 'How do I buy old books on Book Loop BD?',
    a: 'Browse listings on the homepage, open any book you like, and tap "Order Now". You will confirm your delivery address at checkout. There is no online payment — you pay the courier in cash when the book arrives at your door.',
  },
  {
    q: 'How do I sell my used books?',
    a: 'Create a free account, complete your profile with your address and bKash or Nagad number, then open the Sell page and submit your listing in under two minutes. Our team reviews every listing before it goes live. Once a buyer orders, we arrange pickup and delivery through Steadfast Courier.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes. Every order on Book Loop BD is Cash on Delivery. You inspect the book when the courier hands it over and pay only if you accept it. We do not currently support online payment, bKash, Nagad, or card payment at checkout.',
  },
  {
    q: 'Which districts do you deliver to in Bangladesh?',
    a: 'We deliver to all 64 districts of Bangladesh through Steadfast Courier — including Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh, Comilla, Narayanganj, Gazipur and every other district. Delivery charges are calculated by weight and destination at checkout.',
  },
  {
    q: 'How much does delivery cost?',
    a: 'Delivery is charged by weight and district. The exact amount is shown on the checkout page before you confirm. Inside Dhaka is usually cheapest; outside-Dhaka districts cost slightly more. The buyer pays delivery on top of the book price.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders inside Dhaka arrive in 1–2 working days after the seller hands the book to Steadfast. Outside Dhaka typically takes 2–4 working days depending on the district.',
  },
  {
    q: 'Are the old book prices really cheaper than new?',
    a: 'Yes. Sellers set their own prices, and most used textbooks on Book Loop BD list 40–70% below the original retail price. Condition (Like New, Good, Fair, Worn) is clearly marked on every listing so you know exactly what you are getting.',
  },
  {
    q: 'What kinds of books can I find?',
    a: 'NCTB textbooks for Class 1 to Class 10, SSC and HSC guides, O-Level and A-Level Cambridge and Edexcel books, English grammar and dictionaries, admission preparation books, plus general reading like novels and Islamic books. University-level books are not supported.',
  },
  {
    q: 'Are the listings safe and verified?',
    a: 'Every listing is manually reviewed by our team before going live. Photos, prices, and details are checked so you only see real books from real sellers. Sellers must also complete a verified profile before they can list.',
  },
  {
    q: 'Can I return a book or get a refund?',
    a: 'You can refuse a book at the door if it does not match the listing. Once you accept the delivery and pay the courier, the sale is final — there are no refunds after successful Cash on Delivery.',
  },
];

const FAQ = () => {
  useSEO({
    title: 'FAQ — Buying, Selling, COD & Delivery | Book Loop BD',
    description:
      'Answers about buying and selling old books in Bangladesh on Book Loop BD — Cash on Delivery, district coverage, delivery time, pricing, returns and more.',
    canonicalPath: '/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-heading">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about buying and selling old books on Book Loop
            BD — payment, delivery, district coverage and more.
          </p>
        </header>

        <section className="glass-panel mb-6 p-2 sm:p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-white/40 last:border-b-0"
              >
                <AccordionTrigger className="px-2 text-left text-sm font-semibold text-heading hover:no-underline sm:px-3">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="px-2 text-sm leading-relaxed text-muted-foreground sm:px-3">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="glass-panel flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold text-heading">
              Still have a question?
            </h2>
            <p className="text-sm text-muted-foreground">
              Reach out and our team will get back to you.
            </p>
          </div>
          <Link
            to="/contact"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Contact Us
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
