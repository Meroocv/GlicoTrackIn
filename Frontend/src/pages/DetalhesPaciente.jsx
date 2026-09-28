import { Link, useLocation, useParams } from "react-router-dom"

function DetalhesPaciente() {
  const { id } = useParams()
  const location = useLocation()

  const paciente = location.state?.paciente

  if (!paciente) {
    return (
      <div>
        <div className="alert alert-warning">
          Não foi possível carregar os dados deste paciente.
        </div>

        <Link
          to="/pacientes"
          className="btn btn-outline-secondary"
        >
          ← Voltar para pacientes
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/pacientes"
          className="btn btn-outline-secondary"
        >
          ← Voltar para pacientes
        </Link>
      </div>

      <div className="mb-4">
        <h1>Dados do paciente</h1>

        <p className="text-muted">
          Informações cadastrais do paciente.
        </p>
      </div>

      <div className="card">
        <div className="card-body">

          <h5 className="card-title mb-4">
            {paciente.nome_social || paciente.nome}
          </h5>

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Nome completo</strong>
              <div>{paciente.nome}</div>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Nome social</strong>
              <div>
                {paciente.nome_social || "-"}
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <strong>CPF</strong>
              <div>{paciente.cpf}</div>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Data de nascimento</strong>
              <div>{paciente.data_nascimento}</div>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Telefone</strong>
              <div>{paciente.telefone}</div>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Status</strong>
              <div>
                <span
                  className={
                    paciente.ativo
                      ? "badge text-bg-success"
                      : "badge text-bg-secondary"
                  }
                >
                  {paciente.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

          </div>

          <hr />

          <div className="d-flex gap-2">

            <Link
              to={`/pacientes/${id}/historico`}
              className="btn btn-primary"
            >
              Ver histórico
            </Link>

          </div>

        </div>
      </div>
    </div>
  )
}

export default DetalhesPaciente