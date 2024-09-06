import {Personne} from "./models/Personne.js";
import {Patrimoine} from "./models/Patrimoine.js";
import {BienMateriels} from "./models/Possessions/BienMateriels.js";
import {CompteBancaireCourant, CompteBancaireEpargne, Money} from "./models/Possessions/Money.js";
import { Flux } from "./models/Flux.js";



// Propriétaire du patrimoine
export const Moi = new Personne("Iloniaina");

// Mes possessions et train de vie
export const possessions = [
    new BienMateriels(Moi, "Ordinateur portable", 1000000, "materiel informatique", "2022-02-01"),
    new BienMateriels(Moi, "vêtemens", 300000, "vestimentaire", "2023-03-1"),
    new BienMateriels(Moi, "téléphone", 800000, "vestimentaire", "2019-09-19"),
    new BienMateriels(Moi, "casquette", 20000, "vestimentaire", "2019-09-19"),
    new Money(Moi, "argent en espece", 50000, "2024-7-12"),
    new CompteBancaireEpargne(Moi, "ma compte bancaire epargne", 200000, "2020-06-5"),
    new CompteBancaireCourant(Moi, "ma compte bancaire courant", 100000, "2023-12-04")
];

export const flux = [
    new Flux(Moi, "salaire", 2500000, "2024-08-04", "ENTRANT"),
    new Flux(Moi, "revenu passif", 500000, "2024-8-4", "ENTRANT"),
    new Flux(Moi, "petit boulot", 50000, "2024-8-4", "ENTRANT"),
    new Flux(Moi, "nourriture", 50000, "2024-5-4", "SORTANT"),
    new Flux(Moi, "loyer", 500000, "2024-8-4", "SORTANT"),
    new Flux(Moi, "entretien_voiture",450000, "2024-8-4", "SORTANT")
];


const maPatrimoine = new Patrimoine(Moi, possessions, flux, "2024-08-08");
// console.log(maPatrimoine.scanDate("08 August 2024", "08 August 2024"))
// console.log(maPatrimoine.scanDate(new Date("2023-05-08"), new Date("2024-07-08")));

maPatrimoine.save()
export const patrimony = new Patrimoine(Moi, possessions, flux, "2024-08-08");
console.log(patrimony);


