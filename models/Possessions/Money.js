import {Possession} from "./Possession.js";

export class Money extends Possession{

    constructor(possesseur, libelle, valeur, dateDebut) {
        super(possesseur, libelle, valeur, dateDebut);
        this.dateDebut = dateDebut;
        this.type = "ESPECE";
    }

    get getValeur() {
        return super.getValeur;
    }

    get getDateDebut() {
        return new Date(this.dateDebut);
    }
}


export class CompteBancaireEpargne extends Money {
    /**
     * @param {Person} possesseur
     * @param {String} libelle
     * @param {number} valeur
     */
    constructor(possesseur, libelle, valeur, dateDebut) {
        super(possesseur, libelle,  valeur, dateDebut);
        this.tauxDinteret = 5; // 5%
        this.type = "EPARGNE";
    }

    get getValeur() {
        return this.valeur += Math.round(this.valeur * (this.tauxDinteret / 100));
    }

    /**
     * @param {Date} dateDonnee 
     * @returns {Number}
     */
    getValeurAt(dateDonnee) {
        if (super.getDateDebut <= new Date(dateDonnee)) {
            const intervalDeMois = new Date(dateDonnee).getMonth() - super.getDateDebut.getMonth();
            const intervalDeAnnee =  new Date(dateDonnee).getFullYear() - super.getDateDebut.getFullYear();
            const intervalDeJours = new Date(dateDonnee).getDate() - super.getDateDebut.getDate();
            const nombreAnnee = intervalDeAnnee + intervalDeMois / 12;

            const interet = (super.getValeur  * (this.tauxDinteret / 100)) * (nombreAnnee + intervalDeJours / 365);

            return Math.round(super.getValeur + interet);
        } else return 0
    }
}


export class CompteBancaireCourant extends Money {
    /**
     * @param {Person} possesseur
     * @param {String} libelle
     * @param {number} valeur
     */
    constructor(possesseur, libelle, valeur, dateDebut ) {
        super(possesseur, libelle, valeur, dateDebut);
        this.type = "COURANT";
        this.tauxDeDecouvert = -10000;
    }

    get getValeur() {
        return super.getValeur;
    }
}