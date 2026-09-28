import { Link } from "react-router-dom"

function Sidebar() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
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


         {usuario?.nivel_acesso === "administrador" && (
          <li className="nav-item">
            <Link className="nav-link" to="/admin/acessos">
              Gestão de acessos
            </Link>
          </li>
        )}
      </ul>
    </aside>
  )
}

export default Sidebar
