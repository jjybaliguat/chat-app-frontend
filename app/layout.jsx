import './globals.css'
import MyProvider from '@/components/MyProvider'

export const metadata = {
  title: 'Just Chat App',
  description: 'Experience the new Chat App',
}

export default function RootLayout({ children }) {
  return (
        <html lang="en">
          <body className="relative">
            <MyProvider>
              {children}
            </MyProvider>
            </body>
        </html>
  )
}
