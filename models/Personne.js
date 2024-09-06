export class Personne {
    
  /**
   * @param {String} nom
   */
  constructor(nom) {
      this.nom = nom;
  }


  get getNom() {
      return this.nom;
  }

  /**
   * @param {String} nom 
   */
  set setNom(nom) {
    this.nom = nom;
  }
}