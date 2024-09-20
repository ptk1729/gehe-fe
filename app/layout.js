// import localFont from "next/font/local";
import AuthProvider from './AuthContext'
import UserProvider from './UserContext'
import './globals.css'
import Navbar from './navbar'

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata = {
  title: 'Gehe.fyi',
  description: 'A simple to use url shortener service',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>{metadata.title}</title>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserProvider>
            <Navbar />
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
