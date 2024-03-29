import bcrypt from 'bcryptjs';
const data = {

    users: [
        {
            name: 'Meli',
            email: 'bodiou.amelie@gmail.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'Meli2',
            email: 'amelie.bodiou@supdevinci-edu.fr',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
    ],
    products: [
        {
            //_id: '1',
            name: 'Rafu',
            slug: 'rafu',
            category: 'petit-mobilier',
            image: '/images/p1.jpg',
            price: 20,
            countInStock:0,
            brand: 'STEP',
            rating:4.5,
            numReviews: 15,
            description: 'Etagere facile à monter',
            color: 'gris',
        },
        {
            //_id: '2',
            name: 'Mwenyekiti',
            slug: 'mwenyekiti',
            category: 'chaise',
            image: '/images/p2.jpg',
            price: 50,
            countInStock:10,
            brand: 'STEP',
            rating:4.5,
            numReviews: 9,
            description: 'Chaise très solide',
            color: 'rouge',

        },
        {
            //_id: '3',
            name: 'Sofa',
            slug: 'sofa',
            category: 'canape',
            image: '/images/p3.jpg',
            price: 700,
            countInStock:3,
            brand: 'SOFA',
            rating:4.5,
            numReviews: 3,
            description: 'Canapé de qualité ',
            color: 'bleu',

        },
        {
            //_id: '4',
            name: 'Matelas',
            slug: 'matelas',
            category: 'literie',
            image: '/images/p4.jpg',
            price: 20,
            countInStock:5,
            brand: 'STEP',
            rating:4.5,
            numReviews: 3,
            description: 'Matelas à image de forme',
            color: 'blanc',

        },
    ],
};

export default data;