import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import "@/styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Cinelista",
  description:
    "No Cinelista, você encontra os títulos mais populares, em alta e melhor avaliados em um só lugar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("theme")?.value;
  const initialTheme = cookieTheme === "dark" ? "dark" : "light";

  return (
    <html
      lang="pt-br"
      data-theme={initialTheme}
      style={{ colorScheme: initialTheme }}
    >
      <body>
        <Script
          id="theme-preload"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var doc = document.documentElement;
                  var cookieMatch = document.cookie.match(/(?:^|; )theme=(dark|light)(?:;|$)/);
                  var cookieTheme = cookieMatch ? cookieMatch[1] : null;
                  var savedTheme = localStorage.getItem("theme");
                  var theme = savedTheme === "dark" || savedTheme === "light"
                    ? savedTheme
                    : cookieTheme;

                  if (theme !== "dark" && theme !== "light") {
                    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "dark"
                      : "light";
                  }

                  doc.setAttribute("data-theme", theme);
                  doc.style.colorScheme = theme;
                } catch (error) {
                  // Keep SSR theme as fallback.
                }
              })();
            `,
          }}
        />
        <Header initialTheme={initialTheme} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
