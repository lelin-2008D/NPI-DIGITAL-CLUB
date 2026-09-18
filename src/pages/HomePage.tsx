import React, { useState } from 'react';
import { useSiteData } from '../hooks/useSiteData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CustomCursor } from '../components/common/CustomCursor';
import { LuxuryLoader } from '../components/common/LuxuryLoader';
import { ScrollIndicator } from '../components/common/ScrollIndicator';
import { Navbar } from '../components/public/Navbar';
import { HeroSection } from '../components/public/HeroSection';
import { StorySection } from '../components/public/StorySection';
import { ServicesSection } from '../components/public/ServicesSection';
import { ProjectsSection } from '../components/public/ProjectsSection';
import { TimelineSection } from '../components/public/TimelineSection';
import { StatsSection } from '../components/public/StatsSection';
import { TeamSection } from '../components/public/TeamSection';
import { GallerySection } from '../components/public/GallerySection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { ContactSection } from '../components/public/ContactSection';
import { RSVPModal } from '../components/public/RSVPModal';
import { Footer } from '../components/public/Footer';

export const HomePage: React.FC = () => {
  const { data } = useSiteData();
  useScrollReveal();

  const [rsvpState, setRsvpState] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
  }>({
    isOpen: false,
    eventId: '',
    eventTitle: '',
  });

  const handleOpenRSVP = (eventId: string, eventTitle: string) => {
    setRsvpState({ isOpen: true, eventId, eventTitle });
  };

  const handleCloseRSVP = () => {
    setRsvpState({ isOpen: false, eventId: '', eventTitle: '' });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CustomCursor />
      <LuxuryLoader />

      <Navbar />

      <main id="scroll-container">
        <HeroSection hero={data?.hero} />
        <StorySection story={data?.story} />
        <ServicesSection whatWeDo={data?.whatWeDo} />
        <ProjectsSection projects={data?.projects} />
        <TimelineSection events={data?.timeline} onRSVP={handleOpenRSVP} />
        <StatsSection stats={data?.story?.stats} />
        <TeamSection team={data?.team} />
        <GallerySection gallery={data?.gallery} />
        <TestimonialsSection testimonials={data?.testimonials} quote={data?.quote} />
        <ContactSection contact={data?.contact} />
      </main>

      <Footer settings={data?.settings} />
      <ScrollIndicator />

      <RSVPModal
        isOpen={rsvpState.isOpen}
        eventId={rsvpState.eventId}
        eventTitle={rsvpState.eventTitle}
        onClose={handleCloseRSVP}
      />
    </div>
  );
};
