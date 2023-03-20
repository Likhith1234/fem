import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import "../css/form.css";

export default class Form extends Component {
    
    sendData = (e) => {
        e.preventDefault();
        console.log(e.target);
        let data = {
            E: e.target.E.value,
            I: e.target.I.value,
            elementsLength: [e.target["element - 1"].value, e.target["element - 2"].value, e.target["element - 3"].value],
            supps: [[e.target["suppnode - 1"].value, e.target["support type - 1"].value], [e.target["suppnode - 2"].value, e.target["support type - 2"].value]],
            loads: [[e.target["loadnode - 1"].value, e.target["load - 1"].value], [e.target["loadnode - 2"].value, e.target["load - 2"].value]],
            beamLength: e.target.beamLength.value,
            nodesCount: e.target.nodesCount.value,
            suppsCount: e.target.suppsCount.value,
            loadsCount: e.target.loadsCount.value,
        };
        // data.elementsLength = this.jsonIteration(e.target, data.nodesCount -1, "element");
        // data.supps = this.jsonIteration(e.target, data.suppsCount, "supp");
        // data.loads = this.jsonIteration(e.target, data.loadsCount, "load");
        console.log(data);
        
        fetch("http://localhost:5000/server", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(dat => {
            console.log(dat);
            if (dat.code === 200) {
                console.log("first")
                return <Navigate to="/results" replace="true" />
            }
        });
    }

    addElement = (e) => {
        console.log(e.target.value);
        let node_count = e.target.value;
        let element_count = node_count - 1;
        let container = document.getElementsByClassName("ele-len-container")[0];
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
        for (let i=0; i< element_count; i++){
            let input = document.createElement("input");
            input.type = "number";
            input.name = "element - " + String(i+1);
            input.placeholder = "Length of element - " + String(i+1);
            input.required = true;
            // input.defaultValue = 1000;
            container.appendChild(input);
        }
    }

    addSupport = (e) => {
        console.log(e.target.value);
        let supp_count = e.target.value;
        let container = document.getElementsByClassName("support-container")[0];
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
        for (let i=0; i< supp_count; i++){
            let div = document.createElement("div");
            let nn_input = document.createElement("input");
            nn_input.type = "number";
            nn_input.name = "suppnode - " + String(i+1);
            nn_input.placeholder = "Node Number - " + String(i+1);
            nn_input.required = true;
            // nn_input.defaultValue = 1;
            div.appendChild(nn_input);

            let supp_input = document.createElement("input");
            supp_input.type = "text";
            supp_input.name = "support type - " + String(i+1);
            supp_input.placeholder = "Type of support at node - " + String(i+1);
            supp_input.required = true;
            // supp_input.defaultValue = "pin";
            div.appendChild(supp_input);
            container.appendChild(div);
        }
    }

    addLoad = (e) => {
        console.log(e.target.value);
        let load_count = e.target.value;
        let container = document.getElementsByClassName("load-container")[0];
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
        for (let i=0; i< load_count; i++){
            let div = document.createElement("div");
            let nn_input = document.createElement("input");
            nn_input.type = "number";
            nn_input.name = "loadnode - " + String(i+1);
            nn_input.placeholder = "Node number - " + String(i+1);
            nn_input.required = true;
            // nn_input.defaultValue = 2;
            div.appendChild(nn_input);

            let load_input = document.createElement("input");
            load_input.type = "number";
            load_input.name = "load - " + String(i+1);
            load_input.placeholder = "Load at node - " + String(i+1) + " (in kN)";
            load_input.required = true;
            // load_input.defaultValue = 20000;
            div.appendChild(load_input);
            container.appendChild(div);
        }
    }

  render() {
    return (
        <div className='container'>
            <h3>Enter the beam</h3>
            <form onSubmit={(event) => this.sendData(event)}>
                {/* <label htmlFor='beamType'>
                    Type of Beam:
                    <select id='beamType'>
                        <option value="cantilever">Cantilever Beam</option>
                        <option value="ssb">Simply Supported Beam</option>
                        <option value="fb">Fixed Beam</option>
                    </select>
                </label> */}
                <label htmlFor='E'>
                    {/* E (in MPa):<input id='E' type="number" required/> */}
                    E (in MPa):<input id='E' type="number" defaultValue="200000" required/>
                </label>
                <label htmlFor='I'>
                {/* I (in mm^4):<input id='I' type="number" required/> */}
                I (in mm^4):<input id='I' type="number" defaultValue="450000000" required/>
                </label>
                <label htmlFor='beamLength'>
                {/* Length of Beam (in mm):<input id='beamLength' type="number" required/> */}
                Length of Beam (in mm):<input id='beamLength' type="number" defaultValue="3000" required/>
                </label>
                <label htmlFor='nodesCount'>
                {/* Number of Nodes:<input id='nodesCount' type="number" onChange={(event) => this.addElement(event)} required/> */}
                Number of Nodes:<input id='nodesCount' type="number" defaultValue="4" onChange={(event) => this.addElement(event)} required/>
                </label>
                <div className='ele-len-container'></div>
                <label htmlFor='suppsCount'>
                {/* Number of Supports:<input id='suppsCount' type="number" onChange={(event) => this.addSupport(event)} required/> */}
                Number of Supports:<input id='suppsCount' type="number" defaultValue="2" onChange={(event) => this.addSupport(event)} required/>
                </label>
                <div className='support-container'></div>

                <label htmlFor='loadsCount'>
                {/* Number of Loads:<input id='loadsCount' type="number" onChange={(event) => this.addLoad(event)} required/> */}
                Number of Loads:<input id='loadsCount' type="number" defaultValue="2" onChange={(event) => this.addLoad(event)} required/>
                </label>
                <div className='load-container'></div>
                
                
                {/* <label htmlFor='loadsType'>
                    Type of Loads:
                    <select id='loadsType'>
                        <option value="concentrated">Concentrated Loads</option>
                        <option value="ssb">UDL</option>
                        <option value="fb">Both</option>
                    </select>
                </label> */}
                <div className='submit-options'>
                    {/* <Link className='link submit' to="/results">Submit</Link> */}
                    <button type="submit">Next</button>
                    <button type='reset'>Reset</button>
                </div>
            </form>
        </div>
    )
  }
}
