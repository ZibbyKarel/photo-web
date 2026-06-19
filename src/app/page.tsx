import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Process />
      <GalleryPreview />
      <Pricing />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
