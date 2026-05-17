import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';
import { Link } from 'react-router-dom';
import { BookOpen, Leaf, ShieldCheck, Users, Wallet, Truck } from 'lucide-react';

const About = () => {
  useSEO({
    title: 'About Book Loop BD — Buy & Sell Old Books in Bangladesh',
    description:
      "Book Loop BD is Bangladesh's trusted marketplace to buy and sell old school and college books at the lowest prices, with Cash on Delivery across all 64 districts.",
    canonicalPath: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Book Loop BD',
      url: 'https://bookloopbd.com',
      logo: 'https://bookloopbd.com/favicon.png',
      foundingDate: '2026-03',
      founder: { '@type': 'Person', name: 'Marjuk Muztahid' },
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      description:
        'Student-first marketplace to buy and sell second-hand school and college textbooks across Bangladesh.',
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-16">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-heading">
            About Book Loop BD
          </h1>
          <p className="text-sm text-muted-foreground">
            Bangladesh's student-first marketplace for second-hand books — built to make
            education affordable, trustworthy, and sustainable.
          </p>
        </header>

        {/* Intro */}
        <section className="glass-panel mb-6 space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Book Loop BD</strong> is a second-hand
            textbook marketplace built specifically for students in Bangladesh. Whether
            you are searching for <em>old books in BD</em>, looking to{' '}
            <em>buy old books online</em>, or want to <em>sell used books</em> from last
            year, our platform brings every step together in one trusted place. Our
            mission is simple: give every book a second life while making quality
            education more affordable for everyone.
          </p>
          <p>
            The idea came from a simple observation. Thousands of students across
            Bangladesh already buy and sell used textbooks through Facebook groups and
            informal networks. While the demand is huge, the experience is often
            unorganized, unreliable, and difficult to trust. Prices vary wildly,
            delivery is uncertain, and there is no protection for either side. Book Loop
            BD was created to bring structure, trust, and simplicity to this process.
          </p>
          <p>
            Founded by <strong className="text-foreground">Marjuk Muztahid</strong> in
            March 2026, Book Loop BD gives students a dedicated, modern platform to
            find, sell, and exchange textbooks for Bangla Version, English Version, and
            English Medium curricula — covering classes 1 to 12, including SSC, HSC,
            O-Level, and A-Level.
          </p>
        </section>

        {/* Our Story */}
        <section className="glass-panel mb-6 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-heading">Our Story</h2>
          <p>
            Every year, millions of textbooks are bought new in Bangladesh — and within
            twelve months, most of them sit unused on a shelf. Meanwhile, the next batch
            of students starts the same cycle, paying full price for books that already
            exist in nearly perfect condition just a few kilometres away. Book Loop BD
            was built to close that loop. By connecting sellers who no longer need their
            books with buyers who do, we turn forgotten textbooks into someone else's
            opportunity to learn.
          </p>
        </section>

        {/* Mission */}
        <section className="glass-panel mb-6 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-heading">Our Mission</h2>
          <p>
            We believe no student should be priced out of learning. Our mission is to
            make second-hand books in Bangladesh easy to discover, fairly priced, and
            safe to buy — so every taka saved on a textbook can go toward tuition,
            tutoring, or simply a better future.
          </p>
        </section>

        {/* Why choose us — feature grid */}
        <section className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-heading">
            Why Students Choose Book Loop BD
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                icon: Wallet,
                title: 'Lowest Old Book Prices',
                body: 'Sellers set their own prices and most used textbooks list 40–70% below retail.',
              },
              {
                icon: Truck,
                title: 'Cash on Delivery',
                body: 'Pay only when your book arrives. Nationwide delivery via Steadfast Courier across all 64 districts.',
              },
              {
                icon: ShieldCheck,
                title: 'Verified Listings',
                body: 'Every listing is reviewed by our team before going live, so you only see real books from real sellers.',
              },
              {
                icon: BookOpen,
                title: 'Every Curriculum',
                body: 'Bangla Version, English Version, English Medium, plus general reading — from Class 1 to A-Level.',
              },
              {
                icon: Users,
                title: 'Student-to-Student',
                body: 'You buy from and sell to fellow students. No middlemen, no inflated markups.',
              },
              {
                icon: Leaf,
                title: 'Greener Learning',
                body: 'Every reused textbook saves paper, water, and energy — a small choice with a real impact.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-panel-sm p-4">
                <Icon size={18} className="mb-2 text-primary" />
                <h3 className="mb-1 text-sm font-semibold text-heading">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you can buy & sell */}
        <section className="glass-panel mb-6 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-heading">
            What You Can Buy and Sell
          </h2>
          <p>
            Book Loop BD covers the full school and college journey in Bangladesh.
            Popular categories include:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong className="text-foreground">NCTB textbooks</strong> for Class 1 to
              Class 10 (Bangla and English Version)
            </li>
            <li>
              <strong className="text-foreground">SSC and HSC guides</strong> and
              reference books — Physics, Chemistry, Biology, Higher Math, Accounting,
              ICT and more
            </li>
            <li>
              <strong className="text-foreground">O-Level and A-Level</strong> Cambridge
              and Edexcel textbooks
            </li>
            <li>
              <strong className="text-foreground">English grammar, dictionaries</strong>{' '}
              and admission preparation books
            </li>
            <li>
              <strong className="text-foreground">General reading</strong> — novels,
              biographies, self-development and Islamic books in Bangla and English
            </li>
          </ul>
          <p>
            University-level books are not currently supported — we focus on the school
            and college audience where second-hand demand is highest.
          </p>
        </section>

        {/* How it works (brief) */}
        <section className="glass-panel mb-6 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-heading">How It Works</h2>
          <p>
            Buying is simple: browse listings, pick a book, place a Cash on Delivery
            order, and pay the courier when it arrives. Selling is just as easy — list
            your book in under two minutes, our team approves it, and we handle pickup
            and delivery once it sells. For a full walkthrough, visit our{' '}
            <Link to="/how-it-works" className="font-semibold text-primary hover:underline">
              How It Works
            </Link>{' '}
            page.
          </p>
        </section>

        {/* Sustainability */}
        <section className="glass-panel mb-6 space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-heading">
            Sustainability and Community
          </h2>
          <p>
            Beyond affordability, Book Loop BD supports a more sustainable Bangladesh.
            Every reused textbook reduces demand for new paper, lowers printing
            emissions, and keeps usable books out of landfills. Multiply that by
            thousands of students each semester and the impact becomes real — a
            resource-efficient education ecosystem built one shared book at a time.
          </p>
          <p>
            At its core, Book Loop BD is about community, accessibility, and
            sustainability — empowering students while giving every book the chance to
            continue its journey.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-heading">
            Frequently Asked Questions
          </h2>
          <div className="glass-panel p-2 sm:p-4">
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
          </div>
        </section>

        {/* CTA */}
        <section className="glass-panel flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-lg font-semibold text-heading">
              Ready to give a book its second life?
            </h2>
            <p className="text-sm text-muted-foreground">
              Buy your next textbook for less, or turn last year's books into cash.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Browse Books
            </Link>
            <Link
              to="/sell"
              className="rounded-full border border-primary/30 bg-white/60 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-md transition hover:bg-white"
            >
              Sell a Book
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
