export interface IAnimal {
  id?: number;
  name?: string;
  color?: string;
  price?: number;
  age?: number;
  breed_id?: number;
  breed_name?: string | null;
  short_description?: string;
  description?: string;
  image?: string | null;
}

export interface IAnimalBreed {
  id?: number;
  name?: string;
}
