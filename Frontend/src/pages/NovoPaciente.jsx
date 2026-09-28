import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cadastrarPaciente } from "../services/pacientes"

function NovoPaciente() {
  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    nome: "",
    nome_social: "",
    cpf: "",
    data_nascimento: "",
    telefone: "",
    ativo: true,
  })

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  function alterarCampo(event) {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  async function enviarFormulario(event) {
    event.preventDefault()

    setErro(null)
    setCarregando(true)

    try {
      await cadastrarPaciente(formulario)

      navigate("/pacientes")
    } catch (erro) {
      console.error(erro)

      if (erro.response?.data) {
        setErro(JSON.stringify(erro.response.data))
      } else {
        setErro("Não foi possível cadastrar o paciente.")
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-4">
        <Link
          to="/pacientes"
          className="btn btn-outline-secondary"
        >
          ← Voltar para pacientes
        </Link>
      </div>

      <div className="mb-4">
        <h1>Novo paciente</h1>

        <p className="text-muted">
          Cadastre um novo paciente no sistema.
        </p>
      </div>

      {/* Erro */}
      {erro && (
        <div className="alert alert-danger">
          <strong>Erro ao cadastrar:</strong>
          <div>{erro}</div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={enviarFormulario}>

        <div className="card">
          <div className="card-body">

            <div className="row">

              {/* Nome */}
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="nome"
                  className="form-label"
                >
                  Nome completo *
                </label>

                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="form-control"
                  value={formulario.nome}
                  onChange={alterarCampo}
                  required
                />
              </div>

              {/* Nome social */}
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="nome_social"
                  className="form-label"
                >
                  Nome social
                </label>

                <input
                  type="text"
                  id="nome_social"
                  name="nome_social"
                  className="form-control"
                  value={formulario.nome_social}
                  onChange={alterarCampo}
                />
              </div>

              {/* CPF */}
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="cpf"
                  className="form-label"
                >
                  CPF *
                </label>

                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  className="form-control"
                  value={formulario.cpf}
                  onChange={alterarCampo}
                  placeholder="00000000000"
                  required
                />
              </div>

              {/* Data de nascimento */}
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="data_nascimento"
                  className="form-label"
                >
                  Data de nascimento *
                </label>

                <input
                  type="date"
                  id="data_nascimento"
                  name="data_nascimento"
                  className="form-control"
                  value={formulario.data_nascimento}
                  onChange={alterarCampo}
                  required
                />
              </div>

              {/* Telefone */}
              <div className="col-md-6 mb-3">
                <label
                  htmlFor="telefone"
                  className="form-label"
                >
                  Telefone *
                </label>

                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  className="form-control"
                  value={formulario.telefone}
                  onChange={alterarCampo}
                  placeholder="(92) 99999-9999"
                  required
                />
              </div>

            </div>

            <hr />

            {/* Botões */}
            <div className="d-flex gap-2">

              <Link
                to="/pacientes"
                className="btn btn-outline-secondary"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={carregando}
              >
                {carregando
                  ? "Cadastrando..."
                  : "Cadastrar paciente"}
              </button>

            </div>

          </div>
        </div>

      </form>
    </div>
  )
}

export default NovoPaciente