import express, { Request, Response } from "express";
import cors from 'cors'
import { Tproducts, Tusers } from "./types/types";
import { db } from "./database/knex";

function formatDateToCustomString(date: string): string {
  const dateObj = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return dateObj.toLocaleString('pt-BR', options).replace(',', '').replace('/', '-').toString();
}

const api = express();

api.use(express.json())
api.use(cors())

api.listen(3003, () => {
  console.log('listening on http://localhost:3003');
})

api.get("/users", async (req: Request, res: Response) => {
  try {
    const result: Array<Tusers> = await db("users")
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
    const result: Array<Tproducts> = await db('products')

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

api.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    if (id.length < 7 || !id.startsWith('purc')) {
      if (id.length < 7) {
        throw new Error("O ID deve conter no minimo 7 caracteres e deve começar com a sigla 'purc'")
      }
      throw new Error("O ID deve começar com a sigla 'purc'")
    }
    const [exist] = await db('purchases').where({ id })

    if (!exist) {
      throw new Error("Não existe um pedido registrado com esse ID")
    }

    const [purchase] = await db('purchases')
      .select(
        'purchases.id AS purchaseId',
        'purchases.buyer AS buyerId',
        'users.name AS buyerName',
        'users.email AS buyerEmail',
        'purchases.total_price AS totalPrice',
        'purchases.created_at AS createdAt',

      )
      .join(
        "users",
        "purchases.buyer",
        "=",
        "users.id"
      ).where('purchases.id', id)


    const productsInfo: Array<Tproducts> = []

    const purchasedProducts = await db('purchases_products')

      .where('purchase_id', id)

    for (let product of purchasedProducts) {
      const [info] = await db('products')
        .select(
          'id',
          'name',
          'price',
          'description',
          'image_url AS imageUrl'
        )
        .where('id', product.product_id)
      productsInfo.push({ ...info, quantity: product.quantity })
    }
    //console.log({ ...purchase, products: products })

    res.status(200).send({ ...purchase, products: productsInfo })

  } catch (error: any) {
    res.status(400).send(error.message)

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

    const [exist] = await db('users').where({ id }).orWhere({ email })

    if (exist) {
      if (exist.id === id) {
        throw new Error("Id já existe, por favor altere as informações")
      }
      throw new Error("Email já existe, por favor altere as informações")
    }

    await db.insert({
      id,
      name,
      email,
      password,
      created_at: formatDateToCustomString(new Date().toISOString())
    }).into('users')

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

    const [exist] = await db('products').where({ id })

    if (exist) {
      throw new Error("Id já existe, por favor altere as informações")
    }

    await db.insert({
      id,
      name,
      price,
      description,
      image_url: imageUrl
    }).into('products')

    res.status(201).send("Produto cadastrado com sucesso!")

  } catch (error: any) {
    res.status(400).send(error.message)
  }

})


api.post("/purchases", async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string
    const buyer = req.body.buyer as string
    const products = req.body.products as Array<{ id: string, quantity: number }>

    if (id.length < 7 || !id.startsWith("purc")) {
      if (id.length < 7) {
        throw new Error("O id da compra deve ter no minimo 7 caracteres, começando com 'purc' e os numeros em seguida")
      }
      throw new Error("O id da compra deve começar sempre com a sigla 'purc'")

    }

    if (buyer.length < 4 || !buyer.startsWith("u")) {
      if (buyer.length < 4) {
        throw new Error("O id do comprador deve ter no minimo 4 caracteres, começando com 'u' e os numeros em seguida")
      }
      throw new Error("O id do comprador deve começar sempre com a sigla 'u'")

    }

    if (!products) {
      throw new Error("Por favor insira os produtos.")
    }

    const [exist] = await db('purchases').where({ id })

    if (exist) {
      throw new Error("Id já existe, por favor altere as informações")
    }

    const arrayProducts = []

    let totalPrice: number = 0

    for (let product of products) {
      const [info] = await db('products').where({ id: product.id })
      if (!info) {
        throw new Error(`O produto '${product.id}' não existe`)
      }
      arrayProducts.push({ ...info, quantity: product.quantity })
    }

    for (let product of arrayProducts) {
      totalPrice += product.price * product.quantity
    }

    await db.insert({
      id,
      buyer,
      total_price: totalPrice,
      created_at: formatDateToCustomString(new Date().toISOString())
    }).into('purchases')

    for (let product of products) {
      await db('purchases_products')
        .insert({
          purchase_id: id,
          product_id: product.id,
          quantity: product.quantity
        })
    }

    res.status(201).send("Pedido realizado com sucesso")
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})


api.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const [exist] = await db('users').where({ id })

    if (!exist) {
      res.status(400)
      throw new Error("Esse usuario não existe")
    }

    await db.delete().from('users').where({ id })

    res.status(200).send("Usuario apagado com sucesso")
  } catch (error: any) {
    res.send(error.message)
  }

})



api.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const [exist] = await db('products').where({ id })
    if (!exist) {
      res.status(400)
      throw new Error("Esse produto não existe")
    }
    await db.delete().from('products').where({ id })
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
    const [productToEdit] = await db('products').where({ id: idOfProduct })

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
      const [exist] = await db('products').where({ id: newId })
      if (exist && newId !== idOfProduct) {
        throw new Error("O ID que você escolheu já está sendo utilizado, tente outro")
      }
    }
    await db.update({
      id: newId || idOfProduct,
      name: newName || productToEdit.name,
      price: newPrice || productToEdit.price,
      description: newDescription || productToEdit.description,
      image_url: newImageUrl || productToEdit.image_url
    }).from('products').where({ id: idOfProduct })

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

    const [exist] = await db('purchases').where({ id })

    if (!exist) {
      throw new Error("Pedido não existe")
    }

    await db.delete().from('purchases').where({ id })

    res.status(200).send("Pedido cancelado com sucesso")
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})