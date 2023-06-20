// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// npm i puppeteer
// npm i chrome-aws-lambda

import chromium from "chrome-aws-lambda";

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath;
  const puppeteer = require("puppeteer-core");
  if (!executablePath) {
    // running locally

    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

export default async function getCombustibles(req, res) {
  /*  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
 */
  var listapokemon = [];
  let browser = null;
  let result = null;
  var pokemon = {};
  var informacionGeneral = [];

  var a = 1;
  for (a = 100; a < 200; a++) {
    browser = await getBrowserInstance();
    let page = await browser.newPage();
    await page.goto(
      "https://pokefanaticos.com/pokedex/ficha/" + a + "/bulbasaur/"
    );
    page = await page.waitForSelector("app-pokemon-data");

    var descripcion = await page.evaluate(() => {
      const descripcion = document.querySelector("div>div>div>div>div>div>em");
      return descripcion.innerText;
    });

    var tipos = await page.evaluate(() => {
      const tipos = Array.from(
        document.querySelectorAll(
          "div > div > div >  div > div > div.card-body img"
        )
      );
      return tipos.map((img) => img.alt);
    });
    result = await page.evaluate(() => {
      const titulos = Array.from(
        document.querySelectorAll(
          "div > div > div >  div > div > div.card-body"
        )
      );
      return titulos.map((td) => td.innerText);
    });

    informacionGeneral = result[0].split("\n\n");
    pokemon.numero = informacionGeneral[1].replace("# ", "");
    pokemon.nombre = informacionGeneral[3];
    pokemon.descripcion = descripcion;
    pokemon.img = `https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/${pokemon.numero}.png`;
    pokemon.tipo = tipos;
    pokemon.peso = informacionGeneral[6];
    pokemon.altura = informacionGeneral[8];
    pokemon.color = informacionGeneral[10];
    pokemon.forma = informacionGeneral[12];
    pokemon.habitat = informacionGeneral[14];
    pokemon.clasificacion = informacionGeneral[16];
    pokemon.evolucion = [];
    let evoluciones = result[1].split("\n\n");
    evoluciones.forEach((e) => {
      pokemon.evolucion.push(e.split("Pokémon")[0].split("Nivel")[0]);
    });
    pokemon.evoMega = [];
    pokemon.evoGigantamax = [];
    pokemon.crianza = result[3].split("\n\n")[0];
    let puntosBase = result[4].split("\n\n");
    pokemon.puntos = {};
    pokemon.puntos.ps = puntosBase[1];
    pokemon.puntos.ataque = puntosBase[4];
    pokemon.puntos.defensa = puntosBase[7];
    pokemon.puntos.ataqueEspecial = puntosBase[10];
    pokemon.puntos.defensaEspecial = puntosBase[13];
    pokemon.puntos.velocidad = puntosBase[16];
    let habilidades = result[5].split("\n\n")[0].split("\n");
    pokemon.habilidades = [];
    let i = 0;
    habilidades.forEach((e) => {
      if (i > 0) {
        pokemon.habilidades.push({
          nome: e.split("\t")[0],
          descripcion: e.split("\t")[3],
        });
      }
      i++;
    });
    console.log(a);//contador
    listapokemon.push({ ...pokemon });
    await browser.close();
  }
  res.json({ listapokemon });
}

//   console.log({ pokemon: pokemon });
//   console.log(tipos);

/* 
                     for (let i = 0; i < 35; i = i + 5) {
             
                         comb.push({
                             Combustible: result[i],
                             PrecioAnterior: result[i + 1],
                             PrecioActual: result[i + 2],
                             Diferencia: result[i + 3],
                             EstadoAlsa: result[i + 4]
                         });
                     }
    
    
                    let result2 = null;
                    
                    result2 = await page.evaluate(() => {
    
                        const tds = Array.from(document.querySelectorAll('table tr th'))
                        return tds.map(td => td.innerText)
                    });
                   
                    fecha.push({
                        SemanaAnterior: result2[1],
                        SemanaActual: result2[2]
                    });
                    //   /*
  //   //
  //   result = await page.evaluate(() => {

  //         const titulos = Array.from(document.querySelectorAll('div>div>div>div>div>div>div>div>p'))
  //         return titulos.map(td => td.innerText)
  //         //return(document.querySelector('div div div div h2'))

  //     }); */
//     //

//   result = [
//     "Número nacional:\n\n# 1\n\nNombre:\n\nBulbasaur\n\nTipo:\n\nPeso:\n\n6,9 kilogramos\n\nAltura:\n\n0,7 metros\n\nColor:\n\nVerde\n\nForma:\n\nCuadrúpedo\n\nHábitat:\n\nUrbano\n\nClasificación:\n\nPokemon Semilla",
//     "BulbasaurPokémon Inicial\n\nIvysaurNivel 16\n\nVenusaurNivel 32",
//     "Ratio de captura:\n\n45 %\n\nFelicidad base:\n\n70\n\nExperiencia base:\n\n64\n\nVelocidad crecimiento:",
//     "Información de crianza no disponible",
//     "Puntos de salud:\n\n45\n\nEffort: 0\n\nAtaque:\n\n49\n\nEffort: 0\n\nDefensa:\n\n49\n\nEffort: 0\n\nAtaque Especial:\n\n65\n\nEffort: 1\n\nDefensa Especial:\n\n65\n\nEffort: 0\n\nVelocidad:\n\n45\n\nEffort: 0",
//     "Nombre\tNombre Inglés\t¿Es oculta?\tDescripción\nEspesura\tOvergrow\tNO\tAumenta el poder de los ataques de tipo planta un 50%, es decir, multiplica su poder por 1.5, siempre y cuando esté igual o por debajo de un tercio (33%) de sus PS.\nClorofila\tChlorophyll\tSI\tDube la velocidad 2 niveles cuando hay sol, o después de usar día soleado o tras la habilidad sequía. En la saga Pokémon Mundo Misterioso, multiplica la frecuencia de los ataques del Pokémon por turno con tiempo soleado.",
//     "Juego (versión)\tUbicación\nPokémon Edición Rojo\tPokémon Inicial\nPokémon Edición Azul\tPokémon Inicial\nPokémon Edición Amarilla\tCasa a la izquierda del Centro Pokémon de Ciudad Celeste (solo si Pikachu está feliz)\nPokémon Edición Oro\tTransferir de Pokémon Edicion Rojo, Azul, Amarillo\nPokémon Edición Plata\tTransferir de Pokémon Edicion Rojo, Azul, Amarillo\nPokémon Edición Cristal\tTransferir de Pokémon Edicion Rojo, Azul, Amarillo\nPokémon Edición Rubi\tTransferir de Pokémon Edición Rojo Fuego, Verde Hoja\nPokémon Edición Zafiro\tTransferir de Pokémon Edición Rojo Fuego, Verde Hoja\nPokémon Edición Esmeralda\tTransferir de Pokémon Edición Rojo Fuego, Verde Hoja\nPokémon Edición Rojo Fuego\tPokémon Inicial\nPokémon Edición Verde Hoja\tPokémon Inicial\nPokémon Colosseum\tTransferir de Pokémon Edición Rojo Fuego, Verde Hoja\nPokémon X\tCiudad Luminalia\nPokémon Y\tCiudad Luminalia",
//   ];
//   /*   result = await page.evaluate(() => {

//          const titulos = Array.from(document.querySelectorAll('div div h1'))
//          return titulos.map(td => td.innerText)
//      }); */

//   /*    result = await page.evaluate(() => {
//         const titulos = (document.querySelector('h1'))
//         return titulos.innerText

//     }); */
