export let products = [];

export function getProducts(callback) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    const response = JSON.parse(xhr.response);
    products = response.data;  
    callback(); 
  });

  xhr.open("GET", "https://api.myjson.online/v1/records/c9a3ac01-bac5-4891-b917-b8eab5fb8c67");
  xhr.send();
}




