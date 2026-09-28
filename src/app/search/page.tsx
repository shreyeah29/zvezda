import { SearchResultsPage } from "@/components/layout/SearchResultsPage";

export const metadata = {
  title: "Search — Zvezda Atelier",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <SearchResultsPage />;
}
