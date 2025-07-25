import { Elevador } from "./Elevador";

export interface PredioRequest {
    nome: string,
    bairro: string,
    elevadores?: Elevador[]
}