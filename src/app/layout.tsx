import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


const myFont = localFont({
  src: [
    {
      path: '../fonts/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',

    },
    {
      path: '../fonts/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',

    },
    {
      path: '../fonts/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',

    }
  ],
  display: 'swap',
  variable: '--font-custom',
})


export const metadata: Metadata = {
  title: "DiDoo",
  description: "DiDoo website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={myFont.className}
      >
        <QueryClientProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="p-24">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProviderWrapper>


      </body>
    </html>
  );
}

