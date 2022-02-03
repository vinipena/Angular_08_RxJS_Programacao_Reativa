import { merge, Subscription } from 'rxjs';
import { AcoesService } from './acoes.service';
import { Acoes } from './modelo/acoes';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();

  todasAcoes$ = this.acoesService.getAcoes();

  filtradoPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO),
    filter((valorDigitado) => valorDigitado.length >= 3 || !valorDigitado),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
  );

  acoes$ = merge(this.todasAcoes$, this.filtradoPeloInput$);

  // acoes: Acoes;
  // private subscription: Subscription;
  constructor(private acoesService: AcoesService) {}

  // ngOnInit(): void {
  //   this.subscription = this.acoesService.getAcoes().subscribe((acoes) => {
  //     this.acoes = acoes;
  //   });
  // }
  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
}
