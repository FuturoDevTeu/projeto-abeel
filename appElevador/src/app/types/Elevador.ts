import {Componente} from "./Componente";

export interface Elevador{
    id: string,
    modelo: string,
    predioId: string,
    componentes: Componente[];
}