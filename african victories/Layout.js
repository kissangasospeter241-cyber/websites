import Header from './Header'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <Footer />
    </div>
  )
}
