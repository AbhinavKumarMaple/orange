"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { colors } from "@/lib/colors";
import Navbar from "@/components/custom/Navbar";
import NavOverlay from "@/components/custom/NavOverlay";
import ContactSection from "@/components/custom/ContactSection";
import Footer from "@/components/custom/Footer";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export default function ContactPageClient({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      style={{ backgroundColor: colors.background, minHeight: "100vh" }}
    >
      <Navbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen((p) => !p)} variant="dark" />
      <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="pt-24">
        <ContactSection />
      </div>

      <Footer socialLinks={socialLinks} />
    </motion.div>
  );
}
