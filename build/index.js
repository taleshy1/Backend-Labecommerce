"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database/database");
console.log((0, database_1.createUser)("u003", "Astrodev", "astrodev@email.com", "astrodev99"));
console.log("Get Users", (0, database_1.getAllUsers)());
console.log((0, database_1.createProduct)("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://picsum.photos/seed/SSD/400"));
console.log("Get Product", (0, database_1.getAllProducts)());
console.log("search", (0, database_1.searchProductsByName)("gamer"));
//# sourceMappingURL=index.js.map