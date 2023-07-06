import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from "./database/database";
import express, { Request, Response } from "express";
import cors from 'cors'
import { Tproducts, Tusers } from "./types/types";
import { type } from "os";
import { error } from "console";


const api = express();

api.use(express.json())
api.use(cors())

api.listen(3003, () => {
  console.log('listening on http://localhost:3003');
})

api.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(users)
  } catch (error: any) {
    res.status(500).send("Error: erro ao acessar o endpoint")
  }
})

api.get("/products", (req: Request, res: Response) => {

  try {
    const name = req.query.name as string;

    if (name !== undefined) {
      if (name.length < 1) {
        res.status(400)
        throw new Error("O nome deve ter mais de 1 (UM) caracter")
      }
    }

    if (name) {
      const productsFiltered = products.filter(product => product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
      res.status(200).send(productsFiltered)
      res.end()
      return
    }
    res.status(200).send(products)

  } catch (error: any) {
    res.send(error.message)
  }
})

api.post("/users", (req: Request, res: Response) => {
  try {
    const emailRegex = /\S+@\S+\.\S+/;

    const id = req.body.id as string
    const name = req.body.name as string
    const email = req.body.email as string
    const password = req.body.password as string

    if (id.length < 4 || id[0] != "u" || users.find(user => user.id === id)) {
      res.status(400)
      if (id.length < 4) {
        throw new Error("O id deve ter no minimo 4 caracteres")
      } else if (id[0] != "u") {
        throw new Error("O id deve começar com a letra 'U' ")
      }
      throw new Error("O id já existe, tente utilizar outro")
    }

    if (!name) {
      res.status(400)
      throw new Error("Digite um name")
    }

    if (!emailRegex.test(email) || users.find(user => user.email === email)) {
      res.status(400)
      if (!emailRegex.test(email)) {
        throw new Error("Digite um email valido")
      }
      throw new Error("Email já existente, tente outro")
    }

    if (password.length < 8) {
      res.status(400)
      throw new Error("A senha deve ter no mínimo 8 caracteres")
    }


    const newUser: Tusers = {
      id,
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    res.status(201).send("Cadastro realizado com sucesso!")


  } catch (error: any) {
    res.send(error.message)
  }


})

api.post("/products", (req: Request, res: Response) => {
  try {

    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const description = req.body.description as string
    const imageUrl = req.body.imageUrl as string

    if (id.length < 7 || !id.startsWith("prod") || products.find(product => product.id === id)) {
      res.status(400)
      if (id.length < 7) {
        throw new Error("O id deve ter no minimo 7 caracteres, começando com 'prod' e os numeros em seguida")
      } else if (!id.startsWith("prod")) {
        throw new Error("O id deve começar sempre com a sigla 'prod'")
      }
      throw new Error("O id já existe, tente outro")
    }
    if (!name) {
      res.status(400)
      throw new Error("Digite um name")
    }
    if (!price) {
      res.status(400)
      throw new Error("Digite um price")
    }
    if (!description) {
      res.status(400)
      throw new Error("Digite uma description")
    }
    if (!imageUrl) {
      res.status(400)
      throw new Error("Digite uma imageUrl")
    }

    const newProduct: Tproducts = {
      id,
      name,
      price,
      description,
      imageUrl,
    }
    products.push(newProduct)
    res.status(201).send("Produto cadastrado com sucesso!")

  } catch (error: any) {
    res.send(error.message)
  }

})


api.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const userToRemove = users.findIndex(user => user.id === id)
    if (userToRemove < 0) {
      res.status(400)
      throw new Error("Esse usuario não existe")
    }
    users.splice(userToRemove, 1)
    res.status(200).send("User apagado com sucesso")
  } catch (error: any) {
    res.send(error.message)
  }

})


api.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const prodToRemove = products.findIndex(product => product.id === id)
    if (prodToRemove < 0) {
      res.status(400)
      throw new Error("Esse produto não existe")
    }
    products.splice(prodToRemove, 1)
    res.status(200).send("Produto apagado com sucesso")
  } catch (error: any) {
    res.send(error.message)
  }

})


api.put("/products/:id", (req: Request, res: Response) => {

  try {
    const idOfProduct = req.params.id as string


    const newId = req.body.id as string || undefined
    const newName = req.body.name as string || undefined
    const newPrice = req.body.price as number || undefined
    const newDescription = req.body.price as string || undefined
    const newImageUrl = req.body.imageUrl as string || undefined
    const productToEdit = products.find(product => product.id === idOfProduct)

    if (!productToEdit) {
      res.status(400)
      throw new Error("Esse produto não existe")
    }

    if (!newId && !newName && !newPrice && !newDescription && !newImageUrl || newId === productToEdit.id && newName === productToEdit.name && newDescription === productToEdit.description && newImageUrl === productToEdit.imageUrl) {
      res.status(400)
      throw new Error("Para editar o produto é necessario alterar algma informação")
    }


    productToEdit.id = newId || productToEdit.id
    productToEdit.name = newName || productToEdit.name
    productToEdit.price = newPrice || productToEdit.price
    productToEdit.description = newDescription || productToEdit.description
    productToEdit.imageUrl = newImageUrl || productToEdit.imageUrl
    res.status(200).send("Produto atualizado com sucesso")
  } catch (error: any) {
    res.send(error.message)
  }


})