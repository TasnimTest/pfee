

export class User {

   matricule:number;

    username:string;

    nom:string;

    prénom:string;

    email:string;

    poste:string;

    département:string;

    lieu_de_travail:string;

    role:string;

   grade:number;

    note:string;

    nom_equipe : string;

    password?: string;


    constructor( matricule : number,username:string,email:string,nom:string,prénom:string,role:string,poste:string,lieu_de_travail:string,grade:number,note:string,département:string,nom_equipe:string){
        this.matricule=matricule;
        this.username=username;
        this.nom=nom;
        this.prénom=prénom;
        this.département=département;
        this.poste=poste;
        this.role=role;
        this.note=note;
        this.grade=grade;
        this.email=email;
        this.lieu_de_travail=lieu_de_travail;
        this.nom_equipe=nom_equipe;
    }


}
