import api from "./api"

export async function listarPacientes() {
  const resposta = await api.get("pacientes/")

  return resposta.data
}

export async function buscarHistoricoPaciente(id) {
  const resposta = await api.get(`pacientes/${id}/historico/`)

  return resposta.data
}

export async function cadastrarPaciente(dados) {
  const resposta = await api.post("pacientes/", dados)

  return resposta.data
}