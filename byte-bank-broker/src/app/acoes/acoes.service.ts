import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, pluck, tap } from 'rxjs/operators';
import { Acao, AcoesAPI } from './modelo/acoes';

@Injectable({
  providedIn: 'root',
})
export class AcoesService {
  constructor(private httpCliente: HttpClient) {}

  getAcoes(valor?: string) {
    const params = valor ? new HttpParams().append('valor', valor) : undefined;
    return (
      this.httpCliente
        .get<AcoesAPI>('http://localhost:3000/acoes', { params })
        //assim como um cano, no pipe os resultados de cada operador é passado ao proximo.
        .pipe(
          tap((valor) => console.log(valor)),
          //map((api)=>api.payload),
          //ao inves de fazer uma novo map para extrair os dados do payload, o metodo pluck
          //tem essa função apenas recebendo uma string com o nome do atributo o qual os dados serao
          //extraidos
          pluck('payload'),
          map((acoes) =>
            acoes.sort((acaoA, acaoB) => this.ordenaPorCodigo(acaoA, acaoB))
          )
        )
    );
  }
  private ordenaPorCodigo(acaoA: Acao, acaoB: Acao) {
    if (acaoA.codigo > acaoB.codigo) {
      return 1;
    }
    if (acaoB.codigo > acaoA.codigo) {
      return -1;
    }
    return 0;
  }
}
