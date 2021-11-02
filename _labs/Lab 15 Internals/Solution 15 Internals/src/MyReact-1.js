const MyReact = {
    createElement,
    render
}

function createElement(elementType, properties, ...content) {
    if (elementType instanceof Function) return elementType(properties);
    return {
        type:elementType, 
        props:{
            ...properties, 
            children: content.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
                ),
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
        nodeValue: text,
        children: [],
        },
    }
}

function render(element, container, document) {
    // create the dom node given the type, special case for just text, then create a text node
    const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
    // assign properties to the node just created...
    Object.keys(element.props).filter(key => key !== "children").forEach(name => { dom[name] = element.props[name] })
    // walk the tree and process each child... give dom as the node to render in... (recursively)
    element.props.children.forEach(child => render(child, dom, document))
    // add the result to the root element... 
    container.appendChild(dom)
}

export default MyReact