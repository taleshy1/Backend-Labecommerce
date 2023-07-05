import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from "./database/database";
import express, { Request, Response } from "express";
import cors from 'cors'
import { Tproducts, Tusers } from "./types/types";


const api = express();

api.use(express.json())
api.use(cors())

api.listen(3003, () => {
  console.log('listening on http://localhost:3003');
})

api.get("/users", (req: Request, res: Response) => {
  res.status(200).send(users)
})

api.get("/products", (req: Request, res: Response) => {
  const name = req.query.name as string;
  const productsFiltered = products.filter(product => product.name?.toLocaleLowerCase().includes(name?.toLocaleLowerCase()))
  res.status(200).send(productsFiltered.length >= 1 ? productsFiltered : products)
})

api.post("/users", (req: Request, res: Response) => {
  const id = req.body.id as string
  const name = req.body.name as string
  const email = req.body.email as string
  const password = req.body.password as string
  const newUser: Tusers = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  res.status(201).send("Cadastro realizado com sucesso!")
})

api.post("/products", (req: Request, res: Response) => {
  const id = req.body.id as string
  const name = req.body.name as string
  const price = req.body.price as number
  const description = req.body.description as string
  const imageUrl = req.body.imageUrl as string
  const newProduct: Tproducts = {
    id,
    name,
    price,
    description,
    imageUrl,
  }
  products.push(newProduct)
  res.status(201).send("Produto cadastrado com sucesso!")
})

api.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const userToRemove = users.findIndex(user => user.id === id)
  if (userToRemove >= 0) {
    users.splice(userToRemove, 1)
  }
  res.status(200).send("User apagado com sucesso")
})

api.delete("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id
  const prodToRemove = products.findIndex(product => product.id === id)
  if (prodToRemove >= 0) {
    products.splice(prodToRemove, 1)
  }
  res.status(200).send("Produto apagado com sucesso")
})

api.put("/products/:id", (req: Request, res: Response) => {
  const idOfProduct = req.params.id as string


  const newId = req.body.id as string || undefined
  const newName = req.body.name as string || undefined
  const newPrice = req.body.price as number || undefined
  const newDescription = req.body.price as string || undefined
  const newImageUrl = req.body.imageUrl as string || undefined

  const productToEdit = products.find(product => product.id === idOfProduct)

  if (productToEdit) {
    productToEdit.id = newId || productToEdit.id
    productToEdit.name = newName || productToEdit.name
    productToEdit.price = newPrice || productToEdit.price
    productToEdit.description = newDescription || productToEdit.description
    productToEdit.imageUrl = newImageUrl || productToEdit.imageUrl
  }

  res.status(200).send("Produto atualizado com sucesso")

})