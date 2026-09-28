import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { listarPacientes } from "../services/pacientes"

function Pacientes() {

  console.log("PACIENTES COMPONENTE RENDERIZADO")

  const [pacientes, setPacientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    carregarPacientes()
  }, [])

  async function carregarPacientes() {
    try {
      const dados = await listarPacientes()
      setPacientes(dados)
    } catch (erro) {
      console.error(erro)
      setErro("Não foi possível carregar os pacientes.")
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return <p>Carregando pacientes...</p>
  }

  if (erro) {
    return <p className="text-danger">{erro}</p>
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="mb-0">Pacientes</h1>

        <Link
          to="/pacientes/novo"
          className="btn btn-primary"
        >
          + Novo paciente
        </Link>
      </div>

      <p className="text-muted">
        Pacientes cadastrados no sistema.
      </p>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">

          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nome social</th>
              <th>CPF</th>
              <th>Nascimento</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id}>

                <td>{paciente.id}</td>

                <td>{paciente.nome}</td>

                <td>
                  {paciente.nome_social || "-"}
                </td>

                <td>{paciente.cpf}</td>

                <td>{paciente.data_nascimento}</td>

                <td>{paciente.telefone}</td>

                <td>
                  <span
                    className={
                      paciente.ativo
                        ? "badge text-bg-success"
                        : "badge text-bg-secondary"
                    }
                  >
                    {paciente.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td>
                  <div className="d-flex gap-2">

                    <Link
                      to={`/pacientes/${paciente.id}`}
                      state={{ paciente }}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver
                    </Link>

                    <Link
                      to={`/pacientes/${paciente.id}/historico`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Histórico
                    </Link>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default Pacientes