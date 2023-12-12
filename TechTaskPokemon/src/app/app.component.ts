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
  currentPage = 1;
  pageSize = 20; // Cantidad de Pokémon por página
  isDataLoading = false;

  ngOnInit(): void {
    this.loadData();
  }

  //* CARGA DE DATOS :
  async loadData() {
    try {
      this.isDataLoading = true;
      this.Pokemons = await this.getPokemons(this.currentPage);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      this.isDataLoading = false;
    }
  }

  //* OBTENER LOS POKEMONS POR PAGINA :
  async getPokemons(page: number): Promise<Pockemon[]> {
    const promises: Promise<AxiosResponse<Pockemon>>[] = [];

    // Calcular el rango de Pokémon para esta página
    const start = this.pageSize * (page - 1) + 1;
    const end = this.pageSize * page;

    for (let i = start; i <= end; i++) {
      promises.push(
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${i}`)
          .then((response) => response.data)
          .catch(() => console.log('error')) // Manejar solicitudes fallidas
      );
    }

    const responses = await Promise.all(promises);

    // Filtrar respuestas nulas o fallidas
    const validResponses: any[] = responses.filter(
      (response) => response !== null
    );

    console.log(validResponses);
    return validResponses;
  }

  //* CARGA DE MAS DATOS :
  async loadMoreData(event: any) {
    try {
      if (!this.isDataLoading) {
        this.isDataLoading = true;

        const nextPage = this.currentPage + 1;
        const nextPageData = await this.getPokemons(nextPage);

        // Añadir un retraso de 1000 milisegundos.
        setTimeout(() => {
          if (nextPageData.length > 0) {
            this.Pokemons = [...this.Pokemons, ...nextPageData];
            this.currentPage = nextPage;

            this.isDataLoading = false;
            event.target.complete();
          } else {
            // Desactivar el Infinite Scroll si no hay más datos
            event.target.disabled = true;
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error al cargar más datos:', error);
      this.isDataLoading = false;
      event.target.complete();
    }
  }
}
