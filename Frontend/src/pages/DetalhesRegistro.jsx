import { Link, useLocation, useParams } from "react-router-dom"

function DetalhesRegistro() {
  const { id, data } = useParams()
  const location = useLocation()

  const registro = location.state?.registro
  const paciente = location.state?.paciente

  function formatarData(data) {
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
  }

  function formatarMomento(momento) {
    const momentos = {
      JEJUM: "Jejum",
      ANTES_REFEICAO: "Antes da refeição",
      APOS_REFEICAO: "Após a refeição",
      ANTES_DORMIR: "Antes de dormir",
    }

    return momentos[momento] || momento
  }

  function formatarTipoAtividade(tipo) {
    const tipos = {
      CAMINHADA: "Caminhada",
      CORRIDA: "Corrida",
      CICLISMO: "Ciclismo",
      MUSCULACAO: "Musculação",
    }

    return tipos[tipo] || tipo
  }

  if (!registro) {
    return (
      <div>
        <div className="alert alert-warning">
          Não foi possível carregar os detalhes deste registro.
        </div>

        <Link
          to={`/pacientes/${id}/historico`}
          className="btn btn-outline-secondary"
        >
          ← Voltar para histórico
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Voltar */}
      <div className="mb-4">
        <Link
          to={`/pacientes/${id}/historico`}
          className="btn btn-outline-secondary"
        >
          ← Voltar para histórico
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-4">
        <h1>Detalhes do acompanhamento</h1>

        <p className="text-muted mb-1">
          <strong>Paciente:</strong>{" "}
          {paciente?.nome_social || paciente?.nome}
        </p>

        <p className="text-muted mb-0">
          <strong>Data:</strong>{" "}
          {formatarData(registro.data)}
        </p>
      </div>

      {/* Glicemias */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Glicemias</strong>
        </div>

        <div className="card-body">
          {registro.glicemias.length === 0 ? (
            <p className="text-muted mb-0">
              Nenhuma glicemia registrada.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Momento</th>
                    <th>Valor</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {registro.glicemias.map((glicemia) => (
                    <tr key={glicemia.id}>
                      <td>{glicemia.horario}</td>

                      <td>
                        {formatarMomento(glicemia.momento)}
                      </td>

                      <td>
                        <strong>
                          {glicemia.valor} mg/dL
                        </strong>
                      </td>

                      <td>
                        {glicemia.observacao || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Atividade */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Atividade física</strong>
        </div>

        <div className="card-body">
          {registro.atividades.length === 0 ? (
            <p className="text-muted mb-0">
              Nenhuma atividade registrada.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Realizou</th>
                    <th>Atividade</th>
                    <th>Duração</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {registro.atividades.map((atividade) => (
                    <tr key={atividade.id}>
                      <td>
                        {atividade.realizou ? "Sim" : "Não"}
                      </td>

                      <td>
                        {formatarTipoAtividade(atividade.tipo)}
                      </td>

                      <td>
                        {atividade.duracao_minutos} minutos
                      </td>

                      <td>
                        {atividade.observacao || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Alimentação */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Alimentação</strong>
        </div>

        <div className="card-body">
          {registro.alimentacao ? (
            <p className="mb-0">
              {registro.alimentacao.descricao || "-"}
            </p>
          ) : (
            <p className="text-muted mb-0">
              Nenhuma alimentação registrada.
            </p>
          )}
        </div>
      </div>

      {/* Hidratação */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Hidratação</strong>
        </div>

        <div className="card-body">
          {registro.hidratacao ? (
            <p className="mb-0">
              Lembrou de se hidratar:{" "}
              <strong>
                {registro.hidratacao.lembrou_de_se_hidratar
                  ? "Sim"
                  : "Não"}
              </strong>
            </p>
          ) : (
            <p className="text-muted mb-0">
              Nenhuma informação registrada.
            </p>
          )}
        </div>
      </div>

      {/* Sono */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Sono</strong>
        </div>

        <div className="card-body">
          {registro.sono ? (
            <p className="mb-0">
              Registro de sono disponível.
            </p>
          ) : (
            <p className="text-muted mb-0">
              Nenhum registro de sono.
            </p>
          )}
        </div>
      </div>

      {/* Sintomas */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Sintomas</strong>
        </div>

        <div className="card-body">
          {registro.sintomas.length === 0 ? (
            <p className="text-muted mb-0">
              Nenhum sintoma registrado.
            </p>
          ) : (
            <ul className="mb-0">
              {registro.sintomas.map((sintoma) => (
                <li key={sintoma.id}>
                  {JSON.stringify(sintoma)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Medicamentos */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Medicamentos</strong>
        </div>

        <div className="card-body">
          {registro.medicamentos.length === 0 ? (
            <p className="text-muted mb-0">
              Nenhum medicamento registrado.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {registro.medicamentos.map((medicamento) => (
                    <tr key={medicamento.id}>
                      <td>{medicamento.horario}</td>

                      <td>{medicamento.status}</td>

                      <td>
                        {medicamento.observacao || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Observações gerais */}
      {registro.observacoes && (
        <div className="card mb-4">
          <div className="card-header">
            <strong>Observações gerais</strong>
          </div>

          <div className="card-body">
            {registro.observacoes}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalhesRegistro