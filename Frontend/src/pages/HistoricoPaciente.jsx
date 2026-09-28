import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { buscarHistoricoPaciente } from "../services/pacientes"

function HistoricoPaciente() {
  const { id } = useParams()

  const [historico, setHistorico] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    carregarHistorico()
  }, [id])

  async function carregarHistorico() {
    try {
      const dados = await buscarHistoricoPaciente(id)
      setHistorico(dados)
    } catch (erro) {
      console.error(erro)
      setErro("Não foi possível carregar o histórico do paciente.")
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data) {
    const [ano, mes, dia] = data.split("-")

    return `${dia}/${mes}/${ano}`
  }

  if (carregando) {
    return <p>Carregando histórico...</p>
  }

  if (erro) {
    return <p className="text-danger">{erro}</p>
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-4">
        <Link to="/pacientes" className="btn btn-outline-secondary">
          ← Voltar para pacientes
        </Link>
      </div>

      <div className="mb-4">
        <h1>Histórico do paciente</h1>

        <p className="text-muted mb-1">
          <strong>Paciente:</strong>{" "}
          {historico.paciente.nome_social || historico.paciente.nome}
        </p>

        <p className="text-muted">
          <strong>CPF:</strong> {historico.paciente.cpf}
        </p>
      </div>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">

          <thead>
            <tr>
              <th>Data</th>
              <th>Glicemias</th>
              <th>Atividade</th>
              <th>Alimentação</th>
              <th>Hidratação</th>
              <th>Sono</th>
              <th>Sintomas</th>
              <th>Medicamentos</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {historico.registros.map((registro) => (
              <tr key={registro.id}>

                {/* Data */}
                <td>
                  <strong>
                    {formatarData(registro.data)}
                  </strong>
                </td>

                {/* Glicemias */}
                <td>
                  {registro.glicemias.length > 0 ? (
                    <span className="badge text-bg-primary">
                      {registro.glicemias.length} registro
                      {registro.glicemias.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-muted">
                      Não registrada
                    </span>
                  )}
                </td>

                {/* Atividade */}
                <td>
                  {registro.atividades.length > 0 ? (
                    <span className="badge text-bg-success">
                      {registro.atividades.length} atividade
                      {registro.atividades.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-muted">
                      Não registrada
                    </span>
                  )}
                </td>

                {/* Alimentação */}
                <td>
                  {registro.alimentacao ? (
                    <span className="badge text-bg-success">
                      Registrada
                    </span>
                  ) : (
                    <span className="text-muted">
                      Não registrada
                    </span>
                  )}
                </td>

                {/* Hidratação */}
                <td>
                  {registro.hidratacao ? (
                    registro.hidratacao.lembrou_de_se_hidratar ? (
                      <span className="badge text-bg-success">
                        Sim
                      </span>
                    ) : (
                      <span className="badge text-bg-warning">
                        Não
                      </span>
                    )
                  ) : (
                    <span className="text-muted">
                      Não registrada
                    </span>
                  )}
                </td>

                {/* Sono */}
                <td>
                  {registro.sono ? (
                    <span className="badge text-bg-success">
                      Registrado
                    </span>
                  ) : (
                    <span className="text-muted">
                      Não registrado
                    </span>
                  )}
                </td>

                {/* Sintomas */}
                <td>
                  {registro.sintomas.length > 0 ? (
                    <span className="badge text-bg-warning">
                      {registro.sintomas.length} sintoma
                      {registro.sintomas.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-muted">
                      Nenhum
                    </span>
                  )}
                </td>

                {/* Medicamentos */}
                <td>
                  {registro.medicamentos.length > 0 ? (
                    <span className="badge text-bg-info">
                      {registro.medicamentos.length} registro
                      {registro.medicamentos.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-muted">
                      Nenhum
                    </span>
                  )}
                </td>

                {/* Ações */}
                <td>
                  <div className="d-flex gap-2">

                    <Link
                        to={`/pacientes/${id}/historico/${registro.data}`}
                        state={{
                            registro: registro,
                            paciente: historico.paciente,
                        }}
                        className="btn btn-sm btn-outline-primary"
                        title="Visualizar"
                        >
                        👁️
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      title="Relatório IA"
                    >
                      🤖
                    </button>

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

export default HistoricoPaciente