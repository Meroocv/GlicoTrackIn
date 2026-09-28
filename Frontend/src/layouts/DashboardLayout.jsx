import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function DashboardLayout({ children }) {
  return (
    <div className="min-vh-100">

      <Navbar />

      <div className="d-flex">

        <Sidebar />

        <main className="p-4 flex-grow-1">
          {children}
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout