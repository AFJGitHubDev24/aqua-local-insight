import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import UploadInterface from "@/components/UploadInterface";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [currentView, setCurrentView] = useState<"hero" | "upload" | "chat">("hero");

  // Handle URL hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "upload") {
        setCurrentView("upload");
      } else if (hash === "demo") {
        setCurrentView("chat");
      } else {
        setCurrentView("hero");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (view: "hero" | "upload" | "chat") => {
    setCurrentView(view);
    if (view === "hero") {
      window.location.hash = "";
    } else if (view === "upload") {
      window.location.hash = "upload";
    } else if (view === "chat") {
      window.location.hash = "demo";
    }
  };

  const handleFileUploaded = () => {
    handleNavigate("chat");
  };

  if (currentView === "chat") {
    return <ChatInterface />;
  }

  if (currentView === "upload") {
    return <UploadInterface onFileUploaded={handleFileUploaded} />;
  }

  return <HeroSection />;
};

export default Index;
