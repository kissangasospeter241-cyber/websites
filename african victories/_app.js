import '../styles/globals.css'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <SEO />
      <Component {...pageProps} />
    </Layout>
  )
}
