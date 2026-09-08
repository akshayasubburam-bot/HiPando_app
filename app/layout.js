import "@/styles/globals.css";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Hi Pando — Find your place in Dubai",
  description:
    "Discover apartments, villas, townhouses and commercial spaces for sale and rent across Dubai.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
