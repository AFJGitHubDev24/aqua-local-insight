import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import UploadInterface from "@/components/UploadInterface";
import ChatInterface from "@/components/ChatInterface";
import { ExcelData } from "@/components/ExcelParser";

const Index = () => {
  const [currentView, setCurrentView] = useState<"hero" | "upload" | "chat">("hero");
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");

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

  const handleFileUploaded = (data: ExcelData[], cols: string[], name: string) => {
    setExcelData(data);
    setColumns(cols);
    setFileName(name);
    handleNavigate("chat");
  };

  if (currentView === "chat") {
    return <ChatInterface data={excelData} columns={columns} fileName={fileName} />;
  }

  if (currentView === "upload") {
    return <UploadInterface onFileUploaded={handleFileUploaded} />;
  }

  return <HeroSection />;
};

export default Index;
