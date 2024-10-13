import anp from "./utils/simplifiedReact.js"
console.log("hi")
const React = anp;
function App(){
    const [state, setState] = anp.useState(0)
    return(
        <div>
 <h1  onClick={() =>{ setState(state + 1);}}>"hallo guys 2"</h1>
 <h1>{state}</h1>
        </div>
        
    );
}
const container = document.getElementById("root")
anp.render(App(), container)