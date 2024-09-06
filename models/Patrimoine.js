import { Flux } from "./Flux.js";
import { Personne } from "./Personne.js";
import { Possession } from "./Possessions/Possession.js";
import {BienMateriels} from "./Possessions/BienMateriels.js";
import { CompteBancaireEpargne, Money } from "./Possessions/Money.js";
import { writeFile } from "../data/index.js";

export class Patrimoine {
    /**
     * @param {Personne} possesseur
     * @param {Object[]} possessions
     * @param {Object[]} flux
     * @param {Date} date 
     */
    constructor(possesseur, possessions, flux, date) {
        this.possesseur = possesseur;
        this.possessions = possessions;
        this.flux = flux;
        this.date = date;
    }

    /**
     * Retourne la patrimoine d'un particulier à une date donnée
     * @param {Date} dateDonnee
     * @returns {Number}
     */
    CalculatePatrimoineValue(dateDonnee) {

        const ensBien = this.possessions.filter(bien => bien instanceof BienMateriels)
        const ensFlux = this.flux.filter(bien => bien instanceof Flux)
        const ensArgent = this.possessions.filter(possession => possession instanceof Money);

        let total = [];
        let savingsAccount = 0;

        ensBien.forEach((bien) => {
            (total.push(bien.getValeurAt(dateDonnee)))
        });
        
        ensFlux.forEach((flux) => {total.push(flux.getValeurAt(dateDonnee))})

        ensArgent.forEach((arg) => {
          if (arg instanceof CompteBancaireEpargne) {
            total.push(arg.getValeurAt(dateDonnee))
            savingsAccount += arg.getValeurAt(dateDonnee)
          }
          else total.push(arg.getValeur)
        });
        // console.log(total);
        return {total: total.reduce((acc, val) => acc + val, 0), savingsAccount};
    }

    /**
     * @param {Date} dateDonnee 
     * @returns {number}
     */
    getPatrimoineValueAt(dateDonnee) {
        if (this.scanDate(dateDonnee, this.date) == false) return 0;
        else return this.CalculatePatrimoineValue(dateDonnee);  
    }

    /**
     * Contruis le fichier JSON
     */
    save() {
        const valeur = [
            {model: "Personne", data: {nom: this.possesseur.getNom}},
            {model: "Patrimoine", data: {
                possesseur: {nom: this.possesseur.getNom},
                possessions: this.possessions,
                flux: this.flux
            }}
        ]
        writeFile("./data/data.json", valeur).then(data => {
            console.log(data)
        }).catch(err => {
            console.error(err);
        })
    }

    
    /**
     * @param {Possession} possession
     */
    addPossession(possession) {
        if (this.possesseur.getNom === possession.possesseur) this.possessions.push(possession)
        else throw new Error(`Cette possession ne peut pas être celle de ${this.possesseur.getNom}`)
    }

    /**
     * @param {Flux} flux
     */
    addFlux(flux) {
        this.flux.push(flux)
    }


    /**
     * @param {Possession} possession
     */
    removePossession(possession) {
        this.possessions.filter(p => p.libelle !== possession.libelle);
    }

    /**
     * @param {TrainDeVie} flux
     */
    removeFlux(flux) {
        this.flux.filter(fl => fl.libelle !== flux.libelle);
    }

        
    /**
    * 
    * @param {Date} dateDonnee 
    * @param {Date} dateDebut 
    */
    scanDate(dateDonnee, dateDebut) {
        const [jour, mois, annee] = [
            new Date(dateDonnee).getDate(), new Date(dateDonnee).getMonth(), new Date(dateDonnee).getFullYear()
        ];
        const [jour1, mois1, annee1] = [
            new Date(dateDebut).getDate(), new Date(dateDebut).getMonth(), new Date(dateDebut).getFullYear()
        ];

        if (jour === jour1 && mois === mois1 && annee === annee1) return true;
        else if (new Date(dateDonnee) > new Date(dateDebut)) return true
        else return false;
     }
    
}

