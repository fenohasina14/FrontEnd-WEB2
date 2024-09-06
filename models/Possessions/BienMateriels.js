import {Possession} from "./Possession.js";
import { Personne } from "../Personne.js";

export class BienMateriels extends Possession {

    /**
     * @param {Person} possesseur
     * @param {Number} valeur
     * @param {String} libelle
     * @param {String} type
     */
    constructor(possesseur, libelle, valeur, type, dateDebut) {
        super(possesseur, libelle, valeur, dateDebut);
        this.type = type;
        this.amortissement = this.type.includes("informatique") ? 10 : 20 ;
    }

    /**
     * Juste application du taux d'amortissement sur la valeur du bien materiel
     * @param {Date} dateDonnee
     */
    applyAmortissement (dateDonnee) {
        if (super.getDateDebut <= new Date(dateDonnee)) {
            const intervalDeMois = new Date(dateDonnee).getMonth() - super.getDateDebut.getMonth();
            const intervalDeAnnee =  new Date(dateDonnee).getFullYear() - super.getDateDebut.getFullYear();
            const intervalDeJours = new Date(dateDonnee).getDay() - super.getDateDebut.getDay();
            const nombreMois = (intervalDeAnnee * 12) + intervalDeMois;

            // console.log(`annee ${intervalDeAnnee} / mois ${intervalDeMois} / jours ${intervalDeJours}`)

            const valeurAmortissement = (this.valeur * (this.amortissement / 100)) * (nombreMois / 12 + intervalDeJours / 365);
            return Math.round(valeurAmortissement);
        } else return 0;
    }

    getValeurAt(dateDonnee) {
        if (new Date(dateDonnee) < super.getDateDebut) return 0;
        else {
            const amortis = this.applyAmortissement(dateDonnee);
            // console.log(amortis);
            return Math.round(this.valeur - amortis);
        }
    }

    get getType() {
        return this.type;
    }
}


// const Ilo = new Personne("Ilo");

// const portable = new BienMateriels(Ilo, "ordinateur portable", 300000, "materiel informatique", "2024-08-08");
// console.log(portable.getValeurAt("2025-08-08"));
