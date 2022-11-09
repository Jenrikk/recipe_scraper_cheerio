import axios from 'axios';
import cheerio from 'cheerio';
// import fs from 'fs';
import inquirer from 'inquirer';
// const cheerio = require('cheerio');

// interface Recipe {
//     nazwa : string,
//     skladnik : string,
//     przepis: string,
//     wskazowki: string
// }


///////////////////////////////////////////////
const getChoice = async () =>
    await inquirer
        .prompt([
            {
                type: "input",
                name: "dish",
                message: "What dish do you want to cook?"
            },
            {
                type: "list",
                name: "website",
                message: "What webpage do you want to use?",
                choices: ['kwestia smaku', 'allrecipes']
            }
        ])
        .then((answers) => {
            // console.log({answers});
            return answers;
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.log("Your console environment is not supported!")
            } else {
                console.log(error)
            }
        })

const selections = await getChoice();
const { dish, website } = selections;
// console.log({ selections });
//////////////////////////////////////////////


// function writeJson(data:string[]) {
//     data = JSON.stringify(data);
//     fs.writeFile('recipe.json', data, error => {
//         if (error) {
//             throw error;
//         }
//     });
// }
//////////////////////////////////////////

class RecipeScraper {

    async title(url) {
        const $ = await this.load(url);
        let name = ($(".col-xs-12 .page-header").text());
        name = (name.slice(name.length / 2));
        const ingredient = ($(".row-2 > div > .group-skladniki").text());
        const recipe = ($(".row-2 > div > .group-przepis").text());
        const steps = ($(".row-2 > div > .group-wskazowki").text());
        //writeJson([name, ingredient, recipe, steps]);
    }

    async load(url) {
        const response = await axios.get(url); //Fetch url, so we have a connection
        const html = await response.data; //make a request to the url, to give us it's data (page content)
        return cheerio.load(html);
    }

    async scrapeRecipe(url) {
        const root = await this.load(url);
        // console.log({root});


        this.title("https://www.kwestiasmaku.com" + String(root(".views-row-first .field-type-image a").attr('href')));



        const list = [];
        root('div .field-name-title')
            .find('h2')
            .each((index, element) => list.push(root(element).text()));
        // await console.log(list.slice(0, 5));
        console.log({ list });
    }


}


async function main() {

    const scraper = new RecipeScraper();

    await scraper.scrapeRecipe(`https://www.kwestiasmaku.com/szukaj?search_api_views_fulltext=${dish}`);

}

main();