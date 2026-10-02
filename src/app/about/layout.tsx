import { AboutChrome } from "@/components/about/AboutChrome";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="about-root">
      <AboutChrome />
      {children}
    </div>
  );
}
