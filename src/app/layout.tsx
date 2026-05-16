import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { HarzourouDomHighlighter } from '../components/harzourou-dom-highlighter'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: { default: 'Harzourou', template: '%s | Harzourou' },
  description: 'Documentation officielle du langage Harzourou',
}

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" fill="none" height="28">
    <defs>
      <linearGradient id="skig" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <path d="M4 30 C4 30 2 27 2 23 C2 17 7 14 12 14 C17 14 20 17 20 21 C20 25 17 27 12 28 C7 29 4 31 4 35 C4 38 7 40 12 40" stroke="url(#skig)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M28 8 C35 8 37 18 44 18 C51 18 53 8 60 8" stroke="url(#skig)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
    <path d="M28 18 C35 18 37 28 44 28 C51 28 53 18 60 18" stroke="url(#skig)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M28 28 C35 28 37 38 44 38 C51 38 53 28 60 28" stroke="url(#skig)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <text x="68" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="22" fill="url(#skig)">Harzourou</text>
  </svg>
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()

  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <HarzourouDomHighlighter />
        <Layout
          navbar={<Navbar logo={<Logo />} projectLink="https://github.com/AbdoulayeCSMN/" />}
          footer={<Footer>MIT {new Date().getFullYear()} © Harzourou — ENSAM Meknès</Footer>}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/AbdoulayeCSMN/harzourou-docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
