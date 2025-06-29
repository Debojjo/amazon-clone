export let products = [];

export async function getProducts() {
  const response = await fetch("https://api.myjson.online/v1/records/c9a3ac01-bac5-4891-b917-b8eab5fb8c67");
  const json = await response.json();
  products = json.data;
}





