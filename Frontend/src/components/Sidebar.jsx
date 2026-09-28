import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="bg-light border-end p-3">
      <h5>Menu</h5>

      <ul className="nav flex-column">
        <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
                Dashboard
            </Link>
        </li>

        <li className="nav-item">
            <Link className="nav-link" to="/pacientes">
                Pacientes
            </Link>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/historico">
            Histórico
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/relatorios">
            Relatórios
          </a>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar