function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child =>
          typeof child === "object"
            ? child
            : createTextElement(child)
        ),
      },
    }
  }

  function useState(initVal){
    let val = initVal
    const state = val
    const setState = (newVal) => {
        val = newVal
        render(firstelement,firstcontainer)
    }

    return [state, setState]
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

let nextUnitOfWork = null
let wipRoot = null

let firstelement = null
let firstcontainer = null
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
    }
    nextUnitOfWork = wipRoot
    firstelement = element
    firstcontainer = container
  }
  
  


function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
}
requestIdleCallback(workLoop)



function commitRoot(){
    commitWork(wipRoot.child)
    wipRoot = null
}


function commitWork(fiber) {
    if (!fiber) {
      return
    }
    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
  }

 

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber)
    }

   

    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
      const element = elements[index]

      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null,
      }

      if (index === 0) {
        fiber.child = newFiber
      } else {
        prevSibling.sibling = newFiber
      }

      prevSibling = newFiber
      index++
    }

    if (fiber.child) {
      return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling
      }
      nextFiber = nextFiber.parent
    }
  }
  

  function createDom(fiber) {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type)
  
    const isProperty = key => key !== "children" && !key.startsWith("on")
    const isEvent = key => key.startsWith("on")
    
    // Menambahkan properti biasa
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach(name => {
        dom[name] = fiber.props[name]
      })
    
    // Menambahkan event listener untuk event seperti onClick
    Object.keys(fiber.props)
      .filter(isEvent)
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2) // misal dari onClick menjadi click
        dom.addEventListener(eventType, fiber.props[name])
      })
  
    
    return dom
  }
  

const anp = {
    createElement,
    render,
    useState
  }

export default anp;





//   const node = document.createElement(element.type)
//   node["title"] = element.props.title
// console.log(node)
//   const text = document.createTextNode("")
//   text["nodeValue"] = element.props.children

//   node.appendChild(text)
//   container.appendChild(node)