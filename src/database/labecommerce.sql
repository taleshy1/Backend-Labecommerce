-- Active: 1689005311322@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

SELECT * FROM users;

PRAGMA table_info (users);

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'Culano',
        'fulano@gmail.com',
        'senhadofulano123',
        '2023-07-10 13:19'
    ), (
        'u002',
        'Ciclano',
        'ciclano@gmail.com',
        'senhadociclano123',
        '2023-07-10 13:20'
    ), (
        'u003',
        'Beltrano',
        'beltrano@gmail.com',
        'senhadobeltrano123',
        '2023-07-10 13:21'
    );

-- END OF USERS SECTION

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT * FROM products;

PRAGMA table_info (products);

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'p001',
        'Mouse gamer',
        199.99,
        'Sensor óptico de alta precisão, design ergonômico, ajuste DPI on-the-fly, botões programáveis, iluminação RGB personalizável.',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'p002',
        'Teclado gamer',
        399.99,
        'Teclado Retroiluminado, clique tátil, layout compacto, construção em alumínio, resposta rápida, teclas programáveis.',
        'https://picsum.photos/seed/Teclado%20gamer/400'
    ), (
        'p003',
        150.00,
        'Mousepad gamer',
        'Superfície de tecido de baixo atrito, base antiderrapante, tamanho estendido, bordas reforçadas, compatível com sensores ópticos/laser.',
        'https://picsum.photos/seed/Mousepad%20gamer/400'
    ), (
        'p004',
        3199.99,
        'Monitor',
        'Monitor IPS de 240Hz, resolução Full HD, tempo de resposta de 1ms, tecnologia FreeSync/G-Sync, ajuste de altura, cores precisas e amplo ângulo de visão.',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'p005',
        1500,
        'Headset gamer',
        'Headset gamer com som surround 7.1, drivers de alta qualidade, microfone retrátil com cancelamento de ruído, conforto ajustável, iluminação RGB, compatibilidade multiplataforma e controles de áudio integrados.',
        'https://picsum.photos/seed/Headset%20gamer/400'
    );