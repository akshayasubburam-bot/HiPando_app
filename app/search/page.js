import { Suspense } from "react";
import SearchResults from "./SearchResults";

export const metadata = {
  title: "Search Properties — Hi Pando",
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
