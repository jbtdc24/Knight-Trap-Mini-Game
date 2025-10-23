import type { Metadata } from 'next';
import { Inter, Baskervville } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
});

const baskervville = Baskervville({ 
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: '400',
  variable: '--font-headline'
});

export const metadata: Metadata = {
  title: 'Knightfall',
  description: 'A medieval knight-themed chess-like game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          inter.variable, 
          baskervville.variable, 
          'font-sans antialiased'
        )}
      >
        <main 
          className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
          style={{
            backgroundImage: "url('/Ingamebackground.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
