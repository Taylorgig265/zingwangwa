import { Hero } from "@/components/sections/hero";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { WhyZingwangwa } from "@/components/sections/why";
import { ScrollStory } from "@/components/sections/scroll-story";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { StructuredData } from "@/components/sections/structured-data";
import { getFeaturedItems, getMenuItems } from "@/lib/menu-queries";

export const revalidate = 60; // ISR — refresh menu data every 60s

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedItems(), getMenuItems()]);
  return (
    <>
      <StructuredData items={all} />
      <Hero />
      <FeaturedCarousel items={featured} />
      <WhyZingwangwa />
      <ScrollStory />
      <Testimonials />
      <CTA />
    </>
  );
}
