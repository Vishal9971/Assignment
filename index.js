if (process.env.MODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Product = require('./models/Product');
mongoose
  // .connect('mongodb://127.0.0.1:27017/assingment')
  .connect(
    process.env.dbURL ||
      'mongodb+srv://sharmavis77:1rftOz2i0BoovPn2@cluster0.qlvgmhd.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('db connect ho gya');
  })
  .catch((e) => {
    console.log('error hai ', e);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  let allProduct = await Product.find({});
  res.render('index', { allProduct });
});
app.get('/new', (req, res) => {
  res.render('new');
});
app.post('/new', async (req, res) => {
  let { name, img, price } = req.body;
  await Product.create({ name, img, price });
  res.redirect('/');
});
app.get('/show/:id', async (req, res) => {
  let { id } = req.params;
  let foundItem = await Product.findById(id);
  res.render('show', { foundItem });
});
app.get('/edit/:id', async (req, res) => {
  let { id } = req.params;
  let foundItem = await Product.findById(id);
  res.render('edit', { foundItem });
});
app.patch('/edit/:id', async (req, res) => {
  let { id } = req.params;
  let { name, img, price } = req.body;
  await Product.findByIdAndUpdate(id, { name, img, price });
  res.redirect('/');
});
app.delete('/delete/:id', async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndDelete(id, {});
  res.redirect('/');
});
const PORT = 8000;
app.listen(PORT, (req, res) => {
  console.log(`server connected at ${PORT}`);
});
