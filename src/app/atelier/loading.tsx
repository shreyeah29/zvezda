import { brand } from "@/data/brand";

export default function AtelierLoading() {
  return (
    <main className="atelier-book atelier-book--gate">
      <div className="atelier-lock">
        <img src={brand.logo.dark} alt="ZVEZDA Atelier" className="atelier-lock__mark" />
        <p className="atelier-book__kicker">Private</p>
        <h1>House book</h1>
        <p className="atelier-book__lede">Opening the lock…</p>
      </div>
    </main>
  );
}
