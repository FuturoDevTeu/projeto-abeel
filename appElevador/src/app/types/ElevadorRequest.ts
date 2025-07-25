import {Componente} from "./Componente";

export interface ElevadorRequest{
    modelo: string,
    componente?: Componente[] 
}