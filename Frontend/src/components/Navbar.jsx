import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Navbar() {

  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  )

  async function sair() {

    try {

      await api.post("/api/usuarios/logout/")

    } catch (erro) {

      console.error("Erro ao realizar logout:", erro)

    } finally {

      localStorage.removeItem("token")
      localStorage.removeItem("usuario")

      navigate("/login", { replace: true })

    }
  }

  return (

    <nav className="navbar navbar-dark bg-dark px-3">

      <span className="navbar-brand mb-0 h1">
        Controle Glicêmico
      </span>

      <div className="d-flex align-items-center gap-3">

        <span className="text-white">
          {usuario?.nome_completo ||
            usuario?.first_name ||
            usuario?.username ||
            "Profissional"}
        </span>

        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          onClick={sair}
        >
          Sair
        </button>

      </div>

    </nav>
  )
}

export default Navbar

