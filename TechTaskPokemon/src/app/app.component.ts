import { Component, OnInit } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Pockemon } from 'src/Interfaces/Pokemon';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  Pokemons: Pockemon[] = [];

  /*
    Nombre, Experiencia, Altura, Peso y Habilidades de cada uno.
  */

  currentPage = 1;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const nextPageData = await this.getPokemons(this.currentPage);
      this.Pokemons = [...this.Pokemons, ...nextPageData];
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async getPokemons(page: number): Promise<Pockemon[]> {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=10&page=${page}`
    );
    const pokemonUrls = response.data.results.map((result: any) => result.url);

    const promises: Promise<AxiosResponse<Pockemon>>[] = pokemonUrls.map(
      (url: string) => axios.get(url)
    );
    const responses = await Promise.all(promises);

    return responses.map((response) => response.data);
  }

  async loadMoreData(event: any) {
    try {
      this.currentPage++;
      const nextPageData = await this.getPokemons(this.currentPage);

      if (nextPageData.length > 0) {
        this.Pokemons = [...this.Pokemons, ...nextPageData];
        event.target.complete();
      } else {
        // Si no hay más elementos, desactiva el Infinite Scroll
        event.target.disabled = true;
      }
    } catch (error) {
      console.error('Error al cargar más datos:', error);
      event.target.complete();
    }
  }

  // ngOnInit(): void {
  //   this.metodoPokemon();
  // }

  // async metodoPokemon() {
  //   const promises: Promise<AxiosResponse<Pockemon>>[] = [];

  //   try {
  //     for (let i = 1; i < 101; i++) {
  //       promises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
  //     }

  //     const responses = await Promise.all(promises);

  //     this.Pokemons = responses.map((response) => response.data);

  //     console.log(this.Pokemons);
  //   } catch (error) {
  //     console.error('Error en las solicitudes HTTP:', error);
  //   }
  // }
}
