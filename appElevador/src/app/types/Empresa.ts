import { Predio } from "./Predio";

export interface EmpresaType {
  id: string;             
  nome: string;            
  predios?: Predio[];
}
