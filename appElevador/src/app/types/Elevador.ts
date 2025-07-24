import { Predio } from "./Predio";
import {Componente} from "./Componente";

export interface Elevador{
    id: string,
    modelo: string,
    predio?: Predio,
    componente: Componente
}