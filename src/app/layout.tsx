import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import { ThemeProvider } from "next-themes";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";


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
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

        </QueryClientProviderWrapper>


      </body>
    </html>
  );
}

