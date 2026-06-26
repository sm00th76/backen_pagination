require("dotenv").config();

const connectDB = require("/Users/bakhdutta/Desktop/resume_stack/code_vector/src/config/db");
const Product = require("/Users/bakhdutta/Desktop/resume_stack/code_vector/src/models/schema");
const { faker } = require("@faker-js/faker");

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Home",
    "Sports",
    "Beauty",
    "Toys",
    "Furniture",
    "Automotive",
    "Grocery"
];

function getRandomCategory() {
    return categories[Math.floor(Math.random() * categories.length)];
}

function randomDate() {
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000; //returns in milliseconds

    return new Date(
        oneYearAgo +
        Math.random() * (now - oneYearAgo)
    );
}

function generateProduct() {

    const created = randomDate();

    const updated = new Date(
        created.getTime() +
        Math.random() * (Date.now() - created.getTime())
    );

    return {

        name: faker.commerce.productName(),

        category: getRandomCategory(),

        price: Number(
            faker.commerce.price({
                min: 50,
                max: 10000
            })
        ),

        createdAt: created,

        updatedAt: updated

    };

}

async function seedDatabase() {

    try {

        await connectDB();

        console.log("Connected to MongoDB");

        await Product.deleteMany({});

        console.log("Old data removed");

        for (

            let inserted = 0;

            inserted < TOTAL_PRODUCTS;

            inserted += BATCH_SIZE

        ) {

            const batch = [];

            for (let i = 0; i < BATCH_SIZE; i++) {

                batch.push(
                    generateProduct()
                );

            }

            await Product.insertMany(batch);

            console.log(
                `${Math.min(
                    inserted + BATCH_SIZE,
                    TOTAL_PRODUCTS
                )}/${TOTAL_PRODUCTS} inserted`
            );

        }

        console.log("Database Seeded Successfully");

        process.exit();

    }

    catch (err) {

        console.error(err);

        process.exit(1);

    }

}

seedDatabase();