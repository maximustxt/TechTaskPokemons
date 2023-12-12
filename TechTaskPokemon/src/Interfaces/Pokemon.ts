export interface Pockemon {
  name: string;
  id: number;
  sprites: {
    back_default: string;
    front_default: string;
    back_shiny: string;
    front_shiny: string;
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  abilities: [{ ability: { name: string } }]; // las habilidades
  stats: [{ base_stat: number; stat: { name: string } }];
  height: string;
  weight: string;
  species: { name: string };
  types: [{ type: { name: string } }];
}
