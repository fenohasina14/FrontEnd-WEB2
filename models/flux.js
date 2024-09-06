import { Personne } from "./Personne.js";
import { Possession } from "./Possessions/Possession.js";


export class Flux extends Possession {

  /**
   * @param {Personne} possesseur 
   * @param {String} libelle 
   * @param {Number} valeur 
   * @param {Date} dateDebut 
   * @param {String} type || ENTRANT || SORTANT
   */
  constructor(possesseur, libelle, valeur, dateDebut, type) {
    super(possesseur, libelle, valeur, dateDebut);
    this.type = type;
  }
 
  /**
   * @param {Date} dateDonnee 
   */
  getValeurAt(dateDonnee) {

    const date = new Date(dateDonnee);
    if (super.getDateDebut > date) {
      return 0
    }

    else {
      const intervalAnnee = date.getFullYear() - super.getDateDebut.getFullYear();
      const intervalMois = date.getMonth() - super.getDateDebut.getMonth();
      // const intervalJour = date.getDate() - super.getDateDebut.getDate();
      let nombreDeMois = (intervalAnnee * 12) + intervalMois;
      // console.log(nombreDeMois, 'nombre de mois', super.getValeur * nombreDeMois, super.getValeur * nombreDeMois);
      return this.type === "ENTRANT" ? super.getValeur * nombreDeMois : -(super.getValeur * nombreDeMois)
    }
  }


  get getType() {
    return this.type.toUpperCase();
  }

}