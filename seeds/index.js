const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')
const URL = 'mongodb+srv://sskdrn:sakthi19@yelp-camp.iiwws.mongodb.net/yelp-camp?retryWrites=true&w=majority';
const localURL = 'mongodb://localhost/yelp-camp';
mongoose.connect(URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection to MongoDB successful.")
    })
    .catch(error => {
        console.log(error);
    });

const getRandomArrayElement = array => array[Math.floor(Math.random() * array.length)]
const seedDataBase = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const randomNo = Math.floor(Math.random() * 1000);
        const randomPrice = 10 + Math.floor(Math.random() * 20);
        const campground = new Campground({
            title: `${getRandomArrayElement(descriptors)} ${getRandomArrayElement(places)}`,
            author: '60ff2de847ccb3a7871ac165',
            price: randomPrice,
            location: `${cities[randomNo].city}, ${cities[randomNo].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomNo].longitude,
                    cities[randomNo].latitude,
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
        })
        await campground.save();
    }
}
seedDataBase()
    .then(() => {
        console.log("Database seed successful.");
        mongoose.connection.close();
    })
    .catch(error => console.log(error))