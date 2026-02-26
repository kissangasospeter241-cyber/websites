import Link from 'next/link'
import styles from '../styles/Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/">
          <span className={styles.brand}>African Victory Safari</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/search" className={styles.navLink}>Search</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
          <Link href="/contact" className={styles.cta}>Book Now</Link>
          <Link href="/admin/login" className={styles.admin}>Admin</Link>
        </nav>
      </div>
    </header>
  )
}
