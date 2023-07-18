import { users, products, } from "./database/database";
import express, { Request, Response } from "express";
import cors from 'cors'
import { Tproducts, Tusers } from "./types/types";
import { db } from "./database/knex";


const api = express();

api.use(express.json())
api.use(cors())

api.listen(3003, () => {
  console.log('listening on http://localhost:3003');
})

api.get("/users", async (req: Request, res: Response) => {
  try {
    const result: Array<Tusers> = await db.raw(`
      SELECT * FROM users;
    `)
    res.status(200).send(result)
  } catch (error: any) {
    res.status(500).send("Error: erro ao acessar o endpoint")
  }
})

api.get("/products", async (req: Request, res: Response) => {

  try {
    const name = req.query.name as string;
    if (name !== undefined) {
      if (name.length < 1) {
        res.status(400)
        throw new Error("O nome deve ter mais de 1 (UM) caracter")
      }
    }
    const result: Array<Tproducts> = await db.raw(`
      SELECT * FROM products;
    `)
    if (name) {

      const resultFiltered: Array<Tproducts> = result.filter((product: Tproducts) => product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
      res.status(200).send(resultFiltered)
      return
    }
    res.status(200).send(result)

  } catch (error: any) {
    res.send(error.message)
  }
})

api.post("/users", async (req: Request, res: Response) => {
  try {
    const emailRegex = /\S+@\S+\.\S+/;

    const id = req.body.id as string
    const name = req.body.name as string
    const email = req.body.email as string
    const password = req.body.password as string

    if (id.length < 4 || id[0] != "u") {
      if (id.length < 4) {
        throw new Error("O id deve ter no minimo 4 caracteres")
      }
      throw new Error("O id deve começar com a letra 'U' ")
    }

    if (!name) {
      throw new Error("Digite um name")
    }

    if (!emailRegex.test(email)) {
      throw new Error("Digite um email valido")

    }

    if (password.length < 8) {
      throw new Error("A senha deve ter no mínimo 8 caracteres")
    }

    const [exist] = await db.raw(`
      SELECT * FROM users
      WHERE id = '${id}' OR email = '${email}'
    `)

    if (exist) {
      if (exist.id === id) {
        throw new Error("Id já existe, por favor altere as informações")
      }
      throw new Error("Email já existe, por favor altere as informações")
    }

    await db.raw(`
      INSERT INTO users(id, name, email, password, createdAt)
      VALUES ('${id}', '${name}', '${email}', '${password}', '${new Date().toISOString()}')
    `)
    res.status(201).send("Cadastro realizado com sucesso!")


  } catch (error: any) {
    res.status(400).send(error.message)
  }


})

api.post("/products", async (req: Request, res: Response) => {
  try {

    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const description = req.body.description as string
    const imageUrl = req.body.imageUrl as string

    if (id.length < 7 || !id.startsWith("prod")) {
      if (id.length < 7) {
        throw new Error("O id deve ter no minimo 7 caracteres, começando com 'prod' e os numeros em seguida")
      }
      throw new Error("O id deve começar sempre com a sigla 'prod'")

    }
    if (!name) {
      throw new Error("Digite um name")
    }
    if (!price) {
      throw new Error("Digite um price")
    }
    if (!description) {
      throw new Error("Digite uma description")
    }
    if (!imageUrl) {
      throw new Error("Digite uma imageUrl")
    }

    const [exist] = await db.raw(`
      SELECT * FROM products
      WHERE id = '${id}'
    `)

    if (exist) {
      throw new Error("Id já existe, por favor altere as informações")
    }

    await db.raw(`
      INSERT INTO products (id, name, price, description, image_url)
      VALUES ('${id}','${name}','${price}','${description}','${imageUrl}')
    `)
    res.status(201).send("Produto cadastrado com sucesso!")

  } catch (error: any) {
    res.status(400).send(error.message)
  }

})


api.post("/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string
    const buyerId = req.body.buyer as string
    const totalPrice = req.body.totalPrice as number

    if (id.length < 7 || !id.startsWith("purc")) {
      if (id.length < 7) {
        throw new Error("O id da compra deve ter no minimo 7 caracteres, começando com 'purc' e os numeros em seguida")
      }
      throw new Error("O id da compra deve começar sempre com a sigla 'purc'")

    }

    if (buyerId.length < 4 || !buyerId.startsWith("u")) {
      if (buyerId.length < 4) {
        throw new Error("O id do comprador deve ter no minimo 4 caracteres, começando com 'u' e os numeros em seguida")
      }
      throw new Error("O id do comprador deve começar sempre com a sigla 'u'")

    }

    if (!totalPrice) {
      throw new Error("Por favor insira um preço total.")
    }

    const [exist] = await db.raw(`
      SELECT * FROM purchases
      WHERE id = '${id}'
    `)

    if (exist) {
      throw new Error("Id já existe, por favor altere as informações")
    }

    await db.raw(`
      INSERT INTO purchases(id, buyer, total_price, created_at)
      VALUES('${id}', '${buyerId}', '${totalPrice}', '${new Date().toISOString()}')
    `)
    res.status(201).send("Pedido realizado com sucesso")
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})


api.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
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


api.put("/products/:id", async (req: Request, res: Response) => {

  try {
    const idOfProduct = req.params.id as string
    const newId = req.body.id as string || undefined
    const newName = req.body.name as string || undefined
    const newPrice = req.body.price as number || undefined
    const newDescription = req.body.description as string || undefined
    const newImageUrl = req.body.imageUrl as string || undefined

    if (idOfProduct.length < 7 || !idOfProduct.startsWith("prod")) {
      if (idOfProduct.length < 7) {
        throw new Error("O ID do produto deve ter no minimo 7 caracteres e começar com a sigla 'prod'")
      }
      throw new Error("O ID do produto deve começar com a sigla 'prod'")
    }
    const [productToEdit] = await db.raw(`
      SELECT * FROM products
      WHERE id = '${idOfProduct}'
    `)

    if (!productToEdit) {
      res.status(400)
      throw new Error("Esse produto não existe")
    }

    if (!newId && !newName && !newPrice && !newDescription && !newImageUrl || newId === productToEdit.id && newName === productToEdit.name && newDescription === productToEdit.description && newImageUrl === productToEdit.image_url) {
      res.status(400)
      throw new Error("Para editar o produto é necessario alterar algma informação")
    }

    if (newId) {
      if (newId.length < 7 || !newId.startsWith("prod")) {
        if (newId.length < 7) {
          throw new Error("O ID do produto deve ter no minimo 7 caracteres e começar com a sigla 'prod'")
        }
        throw new Error("O ID do produto deve começar com a sigla 'prod'")
      }
      const [exist] = await db.raw(`
        SELECT * FROM products
        WHERE id = '${newId}'
      `)
      if (exist && newId !== idOfProduct) {
        throw new Error("O ID que você escolheu já está sendo utilizado, tente outro")
      }
    }
    await db.raw(`
      UPDATE products
      SET
      id = '${newId || productToEdit.id}',
      name = '${newName || productToEdit.name}',
      price = '${newPrice || productToEdit.price}',
      description = '${newDescription || productToEdit.description}',
      image_url = '${newImageUrl || productToEdit.image_url}'
      WHERE id = '${productToEdit.id}'
    `)
    res.status(200).send("Produto atualizado com sucesso")
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})

api.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    if (id.length < 7 || !id.startsWith("purc")) {
      if (id.length < 7) {
        throw new Error("O ID deve ter no minimo 7 caracteres e começar com a sigla 'purc'")
      }
      throw new Error("O ID deve começar com a sigla 'purc'")
    }

    const [exist] = await db.raw(`
      SELECT * FROM purchases
      WHERE id = '${id}'
    `)

    if (!exist) {
      throw new Error("Pedido não existe")
    }

    await db.raw(`
      DELETE FROM purchases
      WHERE id = '${id}'
    `)

    res.status(200).send("Pedido cancelado com sucesso")
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})