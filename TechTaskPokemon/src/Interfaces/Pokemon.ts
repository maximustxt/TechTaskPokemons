export interface Pockemon {
  id: number;
  name: string;
  base_experience: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  abilities: [{ ability: { name: string } }]; // las habilidades
  height: string;
  weight: string;
}
