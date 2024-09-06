import { Personne } from "../Personne.js";

export class Possession {
    /**
     * @param  {Personne} possesseur
     * @param {Number} valeur
     * @param {String} libelle
     * @param {Date} dateDebut
     */
    constructor(possesseur, libelle, valeur, dateDebut) {
        this.possesseur = possesseur;
        this.libelle = libelle;
        this.valeur = valeur >= 0 ? valeur :  new Error("Positive value expected");
        this.dateDebut = new Date(dateDebut);
    }

    get getPossesseur() {
        return this.possesseur;
    }

    get getValeur() {
        return this.valeur;
    }

    get getLibelle() {
        return this.libelle;
    }

    get getDateDebut() {
        return new Date(this.dateDebut);
    }
}