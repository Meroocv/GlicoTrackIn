import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function AlterarSenhaInicial() {
  const navigate = useNavigate()
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  async function salvar(event) {
    event.preventDefault()
    setErro("")
    setSalvando(true)
    try {
      await api.post("/api/usuarios/alterar-senha-inicial/", {
        nova_senha: novaSenha,
        confirmar_senha: confirmacao,
      })
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
      usuario.deve_alterar_senha = false
      localStorage.setItem("usuario", JSON.stringify(usuario))
      navigate("/dashboard", { replace: true })
    } catch (error) {
      const data = error.response?.data
      setErro(data ? Object.values(data).flat().join(" ") : "Não foi possível conectar ao servidor.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm" style={{ width: "min(100%, 440px)" }}>
        <div className="card-body p-4">
          <h1 className="h4 mb-2">Crie sua senha</h1>
          <p className="text-muted mb-4">Por segurança, a senha temporária precisa ser alterada antes de usar o sistema.</p>
          {erro && <div className="alert alert-danger" role="alert">{erro}</div>}
          <form onSubmit={salvar}>
            <div className="mb-3">
              <label className="form-label" htmlFor="nova-senha">Nova senha</label>
              <input id="nova-senha" className="form-control" type="password" autoComplete="new-password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} required />
              <div className="form-text">Use uma senha com pelo menos 8 caracteres, que não seja comum nem composta apenas por números.</div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="confirmar-senha">Confirme a nova senha</label>
              <input id="confirmar-senha" className="form-control" type="password" autoComplete="new-password" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} required />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={salvando}>
              {salvando ? "Salvando…" : "Alterar senha e continuar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AlterarSenhaInicial
