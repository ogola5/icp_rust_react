// import * as React from "react";
// import REACTDOM from "react-dom";
// import App from "./App"
// //import { agrisurance_dao_backend } from "../../declarations/agrisurance_dao_backend";

// const Root = () => {
//     return(
//         <App />
//     )
// }

// REACTDOM.render(<Root/>, document.getElementById("app"));
import * as React from "react";
import ReactDOM from "react-dom/client"; // Import from "react-dom/client"
import App from "./App";

const rootElement = document.getElementById("app");
const root = ReactDOM.createRoot(rootElement); // Use createRoot

root.render(<App />);
