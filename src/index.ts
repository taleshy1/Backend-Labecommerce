import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from "./database/database";

// console.log("Users", "\n", users, "\n", "Products", "\n", products);

console.log(createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99"))

console.log("Get Users", getAllUsers())

console.log(createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/SSD/400"))

console.log("Get Product", getAllProducts())

console.log("search", searchProductsByName("gamer"))