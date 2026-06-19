import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { ScrollLine } from "@/components/animations/ScrollLine";
import { Reveal } from "@/components/animations/Reveal";

export default function Home() {
  return (
    <>
      <ScrollLine />
      <Hero />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Process />
      </Reveal>
      <Reveal>
        <GalleryPreview />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </>
  );
}
