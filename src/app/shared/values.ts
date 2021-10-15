export class Values{

  public static getConnectionString(){
    if(location.hostname == 'localhost') {
      return 'https://localhost:5001/api/';
    }
    else{
      return "https://uni-helper-api.de/api/";
    }
  }
}
