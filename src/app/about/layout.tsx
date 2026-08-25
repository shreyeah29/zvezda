import { Jost } from "next/font/google";
import { AboutChrome } from "@/components/about/AboutChrome";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`about-root ${jost.variable}`}>
      <AboutChrome fontVariable={jost.variable} />
      {children}
    </div>
  );
}
