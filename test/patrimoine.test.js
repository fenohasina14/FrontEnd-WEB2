import { describe, it } from "mocha";
import { assert, expect } from "chai";
import { BienMateriels } from "../models/Possessions/BienMateriels.js";
import { Personne } from "../models/Personne.js";


const Ilo = new Personne("Ilo");

describe("test about depreciation of \"bien\" value", () => {
    const portable = new BienMateriels(Ilo, "ordinateur portable", 300000, "materiel informatique", "2024-08-08");

    it("should return 300000", () => {
        assert.equal(portable.getValeurAt("2024-08-08"), 300000)
    })

    it("should return 0 because thing was not bought", () => {
        assert.equal(portable.getValeurAt("2023-08-08"), 0)
    })


    it("should return approximatively 270000", () => {
        assert.closeTo(portable.getValeurAt("2025-08-08"), 269900, 100)
    })

    
})