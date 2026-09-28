import api from "./api"

console.log("PACIENTES.JS CARREGADO")

export async function listarPacientes() {
  console.log("LISTAR PACIENTES EXECUTADO")

  const resposta = await api.get("/api/pacientes/")

  return resposta.data
}

export async function buscarHistoricoPaciente(id) {
  const resposta = await api.get(`/api/pacientes/${id}/historico/`)

  return resposta.data
}

export async function cadastrarPaciente(dados) {
  const resposta = await api.post("/api/pacientes/", dados)

  return resposta.data
}

