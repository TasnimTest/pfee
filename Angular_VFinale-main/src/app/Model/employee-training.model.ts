import { Avancement, Niveau } from "../Components/formation/formation-enum";



export class EmployeeTraining {
   
 [x: string]: any;
  id_employeetraining: number; 
  id:number;
  userId: number; 
  nom_formation:string; 
  avancement: Avancement; 
  niveau: Niveau; 
  date:Date ;
  imageUrl : string;
  isPublic: boolean;


  constructor(id_employeetraining: number,id :number,userId: number, nom_formation: string,avancement:Avancement, niveau: Niveau,date:Date ,imageUrl:string,ispublic:boolean) {
    this.id_employeetraining = id_employeetraining;
    this.id=id;
    this.userId =userId;
    this.nom_formation = nom_formation;
    this.avancement = avancement ;
    this.niveau = niveau;
    this.date=date;
    this.imageUrl=imageUrl;
    this.isPublic=ispublic;
 
  }
   
}
