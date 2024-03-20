import { NowSysCotacao } from "./now-sys-response";

export interface NowSysProdutoResponse {
  status: string;
  produto: { caracteristicas: NowSysCotacao };
}