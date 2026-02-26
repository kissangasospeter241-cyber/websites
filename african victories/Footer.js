export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} African Victory Safari — All rights reserved.</div>
        <div className="mt-1">Contact: info@africanvictory.tz</div>
      </div>
    </footer>
  )
}
