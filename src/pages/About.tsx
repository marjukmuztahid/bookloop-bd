import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const About = () => {
  useSEO({
    title: 'About — Book Loop BD',
    description: 'Learn about Book Loop BD, a second-hand textbook marketplace for students in Bangladesh founded by Marjuk Muztahid.',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pt-28 pb-16">
        <h1 className="mb-2 text-2xl font-bold text-heading">About Book Loop BD</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Our story, mission, and what drives us forward.
        </p>

        <div className="glass-panel space-y-4 p-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Book Loop BD is a second-hand textbook marketplace built specifically for students in Bangladesh. Our mission is simple: to give every book a second life while making education more affordable for everyone.
          </p>
          <p>
            The idea came from a simple observation. Thousands of students across Bangladesh already buy and sell used textbooks through Facebook groups and informal networks. While the demand is huge, the experience is often unorganized, unreliable, and difficult to trust.
          </p>
          <p>
            Founded by Marjuk Muztahid in March 2026, Book Loop BD was created to bring structure, trust, and simplicity to this process — giving students a dedicated platform to find, sell, and exchange textbooks.
          </p>
          <p>
            Book Loop BD works as a student-to-student marketplace, allowing users to directly list and sell textbooks to other students, helping sellers recover costs while buyers access books at significantly lower prices.
          </p>
          <p>
            Beyond affordability, Book Loop BD supports sustainability. Every reused textbook reduces the demand for new paper, minimizing waste and building a more resource-efficient education ecosystem.
          </p>
          <p>
            At its core, Book Loop BD is about community, accessibility, and sustainability — empowering students while giving every book the chance to continue its journey.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
