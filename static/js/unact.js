// Main function object:
let Unact = {};

// Object wrapper around template string:
Unact.Component = class {
    constructor(template, renderCallback=()=>{}){
        this.data = template;
        this.onRender = renderCallback;
    }
    render(target){
        var e = document.createElement("div")
        e.innerHTML = this.data
        target.appendChild(e);
        this.onRender();
    }
    read(){
        return this.data;
    }
}

// Generate a UnactComponent from a template string:
Unact.fromString = (template, renderCallback=()=>{}) => new Unact.Component(template, renderCallback);

// Generate a UnactComponent from custom object notation:
Unact.fromObject = (tagName, properties={}, innerData="", renderCallback=()=>{})=>{
    let tmp = document.createElement(tagName);
    tmp.innerHTML = innerData;
    for(prop in properties){
        if(properties.hasOwnProperty(prop)){
            tmp.setAttribute(prop, properties[prop]);
        }
    }
    genTemplate = tmp.outerHTML;
    return new Unact.Component(genTemplate, renderCallback);
};