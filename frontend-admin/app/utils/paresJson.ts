export default function parseJson<T = any>(data: string, errorResultData?: any): T {
  if(typeof data === 'string') {
     try{
        return JSON.parse(data) as T;
     }catch{
        return errorResultData || (data as T);
     }  
}
return data;
}