const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const { google } = require("googleapis");
require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");
const cron = require('node-cron');
const now = new Date();
const formattedDate = now.toLocaleString();

const url = "https://softlogicinvest.lk/"; // Replace with the URL you want to scrape

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);


  
cron.schedule('0 */6 * * * ', () => {
  getData();
});
  // getData();
});

async function getData() {


  const auth = new GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SHEET_ID;

  const range = "A1:C1"; // Adjust the range as per your data
  axios
    .get(url)
    .then(async (response) => {
      const $ = cheerio.load(response.data);
      const upwAmountValue = $(".unit-price-wrap").text();

      const myArray = upwAmountValue.split("\n");

      await googleSheets.spreadsheets.values.get(
        {
          spreadsheetId,
          range,
        },
        async (err, resp) => {
          if (err) return console.error("The API returned an error:", err);

          const rows = resp.data.values;

          if (rows) {
            // Iterate through the rows and check if the value exists
            for (const row of rows) {
              if (row.includes(myArray[6].trim())) {
                console.log("Value exists in the spreadsheet!");
                return;
              } else {
                await googleSheets.spreadsheets.values.append({
                  auth,
                  spreadsheetId,
                  range: "Sheet1!A:B",
                  valueInputOption: "USER_ENTERED",
                  resource: {
                    values: [
                      [myArray[1].trim(), myArray[6].trim(), myArray[5].trim()],
                    ],
                  },
                });
                console.log("Value Added!");
                return
              }
            }
          } else {
            await googleSheets.spreadsheets.values.append({
              auth,
              spreadsheetId,
              range: "Sheet1!A:B",
              valueInputOption: "USER_ENTERED",
              resource: {
                values: [
                  [myArray[1].trim(), myArray[6].trim(), myArray[5].trim(), formattedDate],
                ],
              },
            });
            console.log("No data found Value Added .");
            return
          }
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });

}

app.get("/add", async (req, res) => {
  const auth = new GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SHEET_ID;

  const range = "A1:C1"; // Adjust the range as per your data
  axios
    .get(url)
    .then(async (response) => {
      const $ = cheerio.load(response.data);
      const upwAmountValue = $(".unit-price-wrap").text();

      const myArray = upwAmountValue.split("\n");

      await googleSheets.spreadsheets.values.get(
        {
          spreadsheetId,
          range,
        },
        async (err, resp) => {
          if (err) return console.error("The API returned an error:", err);

          const rows = resp.data.values;

          if (rows) {
            // Iterate through the rows and check if the value exists
            for (const row of rows) {
              if (row.includes(myArray[6].trim())) {
                console.log("Value exists in the spreadsheet!");
                res.send({ message: "Value exists in the spreadsheet!" });
                return;
              } else {
                await googleSheets.spreadsheets.values.append({
                  auth,
                  spreadsheetId,
                  range: "Sheet1!A:B",
                  valueInputOption: "USER_ENTERED",
                  resource: {
                    values: [
                      [myArray[1].trim(), myArray[6].trim(), myArray[5].trim(),formattedDate],
                    ],
                  },
                });
                res.send({ message: "Value Added!" });
              }
            }
          } else {
            await googleSheets.spreadsheets.values.append({
              auth,
              spreadsheetId,
              range: "Sheet1!A:B",
              valueInputOption: "USER_ENTERED",
              resource: {
                values: [
                  [myArray[1].trim(), myArray[6].trim(), myArray[5].trim(),formattedDate],
                ],
              },
            });
            res.send({ message: "Value Added!" });
            console.log("No data found.");
          }
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });
});


