import { Elevador } from "./Elevador";

export interface Predio{
    id: string,
    nome: string,
    bairro: string,
    empresaId?: String,
    elevadores?: Elevador[]
}