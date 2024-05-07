
import { Avancement, Niveau } from "../Components/formation/formation-enum";

export class Training {
    id?:number;
    nom_formation:string; 
    avancement: Avancement; 
    niveau: Niveau; 
    date:Date ;
    imageUrl: string; 

    constructor(id:number,nom_formation:string,avancement:Avancement,niveau:Niveau,date:Date,imageUrl:string){
        this.id=id;
        this.nom_formation=nom_formation;
        this.avancement=avancement;
        this.niveau=niveau;
        this.date=date;
        this.imageUrl=imageUrl;
      
    }


}
