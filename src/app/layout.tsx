import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'DronexMC Applications', description:'Join the DronexMC team.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
