import { Tusers, Tproducts } from "../types/types";

export const users: Array<Tusers> = [
  {
    id: "u001",
    name: "Fulano",
    email: "fulano@email.com",
    password: "fulano123",
    createdAt: new Date().toISOString()
  },
  {
    id: "u002",
    name: "Beltrana",
    email: "Beltrana@email.com",
    password: "beltrana00",
    createdAt: new Date().toISOString()
  }
]

export const products: Array<Tproducts> = [
  {
    id: "prod001",
    name: "Mouse gamer",
    price: 250,
    description: "Melhor mouse do mercado!",
    imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
  },
  {
    id: "prod002",
    name: "Monitor",
    price: 900,
    description: "Monitor LED Full HD 24 polegadas",
    imageUrl: "https://picsum.photos/seed/Monitor/400",
  }
]

export const createUser = (id: string, name: string, email: string, password: string): string => {
  const newUser: Tusers = {
    id: id,
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  }
  if (newUser) {
    users.push(newUser)
    return "Cadastro realizado com sucesso"
  } else {
    return "Erro na criação do usuario"
  }
}

export const getAllUsers = (): Array<Tusers> => {
  return users
}

export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string): string => {
  const newProduct: Tproducts = {
    id: id,
    name: name,
    price: price,
    description: description,
    imageUrl: imageUrl,
  }
  if (newProduct) {
    products.push(newProduct)
    return "Produto criado com sucesso"
  } else {
    return "Erro na criação do Produto"
  }
}

export const getAllProducts = (): Array<Tproducts> => {
  return products
}

export const searchProductsByName = (name: string): Array<Tproducts> | Tproducts => {
  return products.filter((product: Tproducts) => product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
}