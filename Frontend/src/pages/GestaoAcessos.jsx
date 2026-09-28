import { useCallback, useEffect, useState } from "react"
import api from "../services/api"

function mensagemErro(error) {
  const data = error.response?.data
  if (!data) return "Não foi possível conectar ao servidor."
  if (typeof data === "string") return data
  return Object.values(data).flat().join(" ") || "Não foi possível concluir a operação."
}

function GestaoAcessos() {
  const [usuarios, setUsuarios] = useState([])
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [nivel, setNivel] = useState("profissional")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [usuarioResetando, setUsuarioResetando] = useState(null)
  const [cpfReset, setCpfReset] = useState("")
  const usuarioAtualId = JSON.parse(localStorage.getItem("usuario") || "null")?.id

  const carregarUsuarios = useCallback(async () => {
    try {
      const resposta = await api.get("/api/usuarios/gestao/")
      setUsuarios(resposta.data)
      setErro("")
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => { carregarUsuarios() }, [carregarUsuarios])

  async function cadastrar(event) {
    event.preventDefault()
    setErro("")
    setSucesso("")
    setSalvando(true)
    try {
      const resposta = await api.post("/api/usuarios/gestao/", {
        nome_completo: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        nivel_acesso: nivel,
      })
      setSucesso(`Acesso criado para ${resposta.data.nome_completo}. Usuário: ${resposta.data.username}. A senha inicial é o CPF informado.`)
      setNome("")
      setCpf("")
      setNivel("profissional")
      await carregarUsuarios()
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setSalvando(false)
    }
  }

  async function salvarEdicao(event) {
    event.preventDefault()
    setErro("")
    setSucesso("")
    setSalvando(true)
    try {
      const resposta = await api.patch(`/api/usuarios/gestao/${usuarioEditando.id}/`, {
        nome_completo: usuarioEditando.nome_completo,
        email: usuarioEditando.email,
        nivel_acesso: usuarioEditando.nivel_acesso,
        ativo: usuarioEditando.ativo,
      })
      setUsuarios((lista) => lista.map((item) => item.id === resposta.data.id ? resposta.data : item))
      setSucesso(`Dados de ${resposta.data.nome_completo} atualizados.`)
      setUsuarioEditando(null)
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setSalvando(false)
    }
  }

  async function resetarSenha(event) {
    event.preventDefault()
    setErro("")
    setSucesso("")
    setSalvando(true)
    try {
      await api.post(`/api/usuarios/gestao/${usuarioResetando.id}/resetar-senha/`, { cpf: cpfReset.replace(/\D/g, "") })
      setUsuarios((lista) => lista.map((item) => item.id === usuarioResetando.id ? { ...item, deve_alterar_senha: true } : item))
      setSucesso(`Senha redefinida. A senha temporária é o CPF informado; ${usuarioResetando.username} deverá trocá-la no próximo acesso.`)
      setUsuarioResetando(null)
      setCpfReset("")
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setSalvando(false)
    }
  }

  async function atualizarStatus(usuario) {
    setErro("")
    setSucesso("")
    try {
      const resposta = await api.patch(`/api/usuarios/gestao/${usuario.id}/`, { ativo: !usuario.ativo })
      setUsuarios((lista) => lista.map((item) => item.id === usuario.id ? resposta.data : item))
      setSucesso(`Acesso de ${usuario.nome_completo || usuario.username} ${resposta.data.ativo ? "ativado" : "desativado"}.`)
    } catch (error) {
      setErro(mensagemErro(error))
    }
  }

  async function excluir(usuario) {
    const confirmado = window.confirm(`Excluir permanentemente o acesso de ${usuario.nome_completo || usuario.username}?`)
    if (!confirmado) return
    setErro("")
    setSucesso("")
    try {
      await api.delete(`/api/usuarios/gestao/${usuario.id}/`)
      setUsuarios((lista) => lista.filter((item) => item.id !== usuario.id))
      setSucesso(`Acesso de ${usuario.nome_completo || usuario.username} excluído.`)
    } catch (error) {
      setErro(mensagemErro(error))
    }
  }

  function abrirEdicao(usuario) {
    setErro("")
    setUsuarioEditando({ ...usuario })
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="h3">Gestão de acessos</h1>
        <p className="text-muted mb-0">Cadastre profissionais e gerencie suas contas e permissões.</p>
      </div>

      {erro && <div className="alert alert-danger" role="alert">{erro}</div>}
      {sucesso && <div className="alert alert-success" role="status">{sucesso}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 mb-3">Cadastrar acesso</h2>
          <form className="row g-3" onSubmit={cadastrar}>
            <div className="col-md-5">
              <label className="form-label" htmlFor="nome-completo">Nome completo</label>
              <input id="nome-completo" className="form-control" value={nome} onChange={(event) => setNome(event.target.value)} autoComplete="name" required />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="cpf-inicial">CPF (senha inicial)</label>
              <input id="cpf-inicial" className="form-control" value={cpf} onChange={(event) => setCpf(event.target.value)} inputMode="numeric" autoComplete="off" maxLength={14} placeholder="000.000.000-00" required />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="nivel-acesso">Nível de acesso</label>
              <select id="nivel-acesso" className="form-select" value={nivel} onChange={(event) => setNivel(event.target.value)}>
                <option value="administrador">Administrador</option>
                <option value="profissional">Profissional</option>
                <option value="leitura">Somente leitura</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100" type="submit" disabled={salvando}>{salvando ? "Cadastrando…" : "Cadastrar"}</button>
            </div>
          </form>
          <p className="small text-muted mt-3 mb-0">O usuário será PRIMEIRO.ÚLTIMO (por exemplo, HOMERO.VARELA). No primeiro acesso, o profissional deverá criar uma nova senha.</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">Contas cadastradas</h2>
          {carregando ? <p className="text-muted mb-0">Carregando contas…</p> : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead><tr><th>Profissional</th><th>Usuário</th><th>Nível</th><th>Primeiro acesso</th><th className="text-end">Ações</th></tr></thead>
                <tbody>
                  {usuarios.map((usuario) => {
                    const contaAdministrativa = usuario.nivel_acesso === "administrador"
                    return (
                      <tr key={usuario.id}>
                        <td>{usuario.nome_completo || `${usuario.first_name} ${usuario.last_name}`.trim()}</td>
                        <td>{usuario.username}</td>
                        <td>{contaAdministrativa ? <span className="badge text-bg-dark">Administrador</span> : usuario.nivel_acesso === "leitura" ? "Somente leitura" : "Profissional"}</td>
                        <td>{usuario.deve_alterar_senha ? <span className="badge text-bg-warning">Pendente</span> : <span className="badge text-bg-success">Concluído</span>}</td>
                        <td className="text-end">
                          <div className="d-flex flex-wrap justify-content-end gap-2">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => abrirEdicao(usuario)}>Editar</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setErro(""); setCpfReset(""); setUsuarioResetando(usuario) }}>Resetar senha</button>
                            <button type="button" className={`btn btn-sm ${usuario.ativo ? "btn-outline-warning" : "btn-outline-success"}`} disabled={usuario.id === usuarioAtualId && usuario.ativo} title={usuario.id === usuarioAtualId ? "Não é possível desativar sua própria conta" : undefined} onClick={() => atualizarStatus(usuario)}>
                              {usuario.ativo ? "Desativar" : "Ativar"}
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger" disabled={usuario.id === usuarioAtualId} title={usuario.id === usuarioAtualId ? "Não é possível excluir sua própria conta" : undefined} onClick={() => excluir(usuario)}>Excluir</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {!usuarios.length && <tr><td colSpan="5" className="text-center text-muted py-4">Nenhuma conta cadastrada.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {usuarioEditando && (
        <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="titulo-editar-acesso" style={{ background: "#0008" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={salvarEdicao}>
                <div className="modal-header">
                  <h2 className="modal-title h5" id="titulo-editar-acesso">Editar profissional</h2>
                  <button type="button" className="btn-close" aria-label="Fechar" onClick={() => setUsuarioEditando(null)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label" htmlFor="editar-nome">Nome completo</label><input id="editar-nome" className="form-control" value={usuarioEditando.nome_completo || ""} onChange={(event) => setUsuarioEditando({ ...usuarioEditando, nome_completo: event.target.value })} required /></div>
                  <div className="mb-3"><label className="form-label" htmlFor="editar-email">E-mail</label><input id="editar-email" className="form-control" type="email" value={usuarioEditando.email || ""} onChange={(event) => setUsuarioEditando({ ...usuarioEditando, email: event.target.value })} /></div>
                  <div className="mb-3"><label className="form-label" htmlFor="editar-nivel">Nível de acesso</label><select id="editar-nivel" className="form-select" value={usuarioEditando.nivel_acesso} disabled={usuarioEditando.superusuario || usuarioEditando.id === usuarioAtualId} onChange={(event) => setUsuarioEditando({ ...usuarioEditando, nivel_acesso: event.target.value })}><option value="administrador">Administrador</option><option value="profissional">Profissional</option><option value="leitura">Somente leitura</option></select></div>
                  <div className="form-check"><input id="editar-ativo" className="form-check-input" type="checkbox" checked={usuarioEditando.ativo} onChange={(event) => setUsuarioEditando({ ...usuarioEditando, ativo: event.target.checked })} /><label className="form-check-label" htmlFor="editar-ativo">Acesso ativo</label></div>
                  <p className="form-text mb-0 mt-2">Ao alterar o nome, o usuário de acesso também será atualizado para PRIMEIRO.ÚLTIMO.</p>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" onClick={() => setUsuarioEditando(null)}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? "Salvando…" : "Salvar alterações"}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {usuarioResetando && (
        <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="titulo-resetar-senha" style={{ background: "#0008" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={resetarSenha}>
                <div className="modal-header"><h2 className="modal-title h5" id="titulo-resetar-senha">Resetar senha</h2><button type="button" className="btn-close" aria-label="Fechar" onClick={() => setUsuarioResetando(null)} /></div>
                <div className="modal-body">
                  <p>A senha temporária de <strong>{usuarioResetando.nome_completo || usuarioResetando.username}</strong> será o CPF informado. A conta exigirá uma nova senha no próximo login.</p>
                  <label className="form-label" htmlFor="cpf-reset">CPF</label>
                  <input id="cpf-reset" className="form-control" value={cpfReset} onChange={(event) => setCpfReset(event.target.value)} inputMode="numeric" autoComplete="off" maxLength={14} placeholder="000.000.000-00" required />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" onClick={() => setUsuarioResetando(null)}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? "Resetando…" : "Confirmar reset"}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default GestaoAcessos
