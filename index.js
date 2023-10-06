const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://softlogicinvest.lk/'; // Replace with the URL you want to scrape


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  getData();
});



function getData(){
    axios.get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const upwAmountValue = $('.unit-price-wrap').text();
      const myString = "apple,banana,cherry";
const myArray = upwAmountValue.split('\n');

      fs.writeFile('example.txt', upwAmountValue, (err) => {
        if (err) throw err;
        console.log('File created and content written successfully.');
      });
      // console.log('Value under upw-amount:', myArray);
      for(let i =0 ; i < myArray.length ; i++){
        console.log("i" , myArray[i])
      }

    })
    .catch(error => {
      console.error(error);
    });
}