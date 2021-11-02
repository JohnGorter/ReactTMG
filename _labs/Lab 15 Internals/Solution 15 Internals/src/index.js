/** @jsx MyReact.createElement */
import MyReact from './MyReact.js'

const MyApp = () => {
    const [state, setState] = MyReact.useState(1);
    return <div onClick={() => setState(c => c + 1)}> Count: { state } </div>
}
MyReact.render(<MyApp />, document.querySelector("#container"), document)  
