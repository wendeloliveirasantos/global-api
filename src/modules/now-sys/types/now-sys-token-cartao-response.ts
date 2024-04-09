export interface NowSysTokenCartaoResponse {
  status: string;
  mensagem: string;
  retorno: {
    id: string;
    method: string;
    extra_info: {
      bin: string;
      year: number;
      month: number;
      brand: string;
      holder_name: string;
      display_number: string;
    },
    test: boolean;
  }
}