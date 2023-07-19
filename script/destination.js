let main_container = document.querySelector("#blank");
let searchinp = document.querySelector("#mainsearch>input");
let searchbtn = document.querySelector("#mainsearch>button");
let limit = 12
let total_data;
searchbtn.addEventListener("click",()=>{
    datafetch(`https://main-mock-server.onrender.com/destinations?q=${searchinp.value}&_page=1&_limit=${limit}`)
})
async function datafetch(url,){
    try{
        res = await fetch(url);
        data = await res.json();
        total_data = data.length;
        
        console.log(data);
    }
    catch(err){
        console.log(err)
    }
}
