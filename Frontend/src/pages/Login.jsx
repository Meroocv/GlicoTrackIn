import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"


function Login() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)


  async function fazerLogin(event) {

    event.preventDefault()

    setErro("")
    setCarregando(true)

    try {

      const resposta = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/usuarios/login/`,
        {
          username: username,
          password: password
        }
      )

      const token = resposta.data.token

      localStorage.setItem("token", token)

      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.data.usuario)
      )

      navigate(resposta.data.deve_alterar_senha ? "/alterar-senha" : "/dashboard", { replace: true })

    } catch (error) {

      if (error.response) {

        setErro(
          error.response.data.erro ||
          "Usuário ou senha inválidos."
        )

      } else {

        setErro(
          "Não foi possível conectar ao servidor."
        )
      }

    } finally {

      setCarregando(false)

    }
  }


  return (

    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="card shadow-sm" style={{ width: "400px" }}>

        <div className="card-body p-4">

          <h2 className="text-center mb-4">
            GlicoTrackIn
          </h2>

          <p className="text-center text-muted mb-4">
            Acesso ao sistema
          </p>


          {erro && (
            <div className="alert alert-danger">
              {erro}
            </div>
          )}


          <form onSubmit={fazerLogin}>

            <div className="mb-3">

              <label className="form-label">
                Usuário
              </label>

              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Digite seu usuário"
                required
              />

            </div>


            <div className="mb-4">

              <label className="form-label">
                Senha
              </label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Digite sua senha"
                required
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={carregando}
            >

              {carregando
                ? "Entrando..."
                : "Entrar"
              }

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}


export default Login

