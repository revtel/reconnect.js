(self.webpackChunkdoc=self.webpackChunkdoc||[]).push([[671],{426:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return s},metadata:function(){return l},toc:function(){return r},default:function(){return c}});var o=n(2122),a=n(9756),i=(n(7294),n(3905)),s={sidebar_position:1},l={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Introduction",description:"Install",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/reconnect.js/docs/intro",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/intro.md",version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Examples",permalink:"/reconnect.js/docs/examples"}},r=[{value:"Install",id:"install",children:[]},{value:"What Is It?",id:"what-is-it",children:[]},{value:"Why Do I Need This?",id:"why-do-i-need-this",children:[{value:"Case 1: Share States Between Sibling Components",id:"case-1-share-states-between-sibling-components",children:[]},{value:"Case 2: Share States Between Deeply Nested Components",id:"case-2-share-states-between-deeply-nested-components",children:[]},{value:"Case 3: Notify Child Component About Some Events",id:"case-3-notify-child-component-about-some-events",children:[]}]},{value:"That&#39;s why you might want to use Reconnect.js!",id:"thats-why-you-might-want-to-use-reconnectjs",children:[]}],u={toc:r};function c(e){var t=e.components,n=(0,a.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"install"},"Install"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"npm i reconnect.js")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"You can use it in your React Native, or even pure NodeJS projects as well!")),(0,i.kt)("h2",{id:"what-is-it"},"What Is It?"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Reconnect.js")," is the library to help you manage share states between ",(0,i.kt)("strong",{parentName:"p"},"sibling")," or ",(0,i.kt)("strong",{parentName:"p"},"deeply nested")," React Components."),(0,i.kt)("h2",{id:"why-do-i-need-this"},"Why Do I Need This?"),(0,i.kt)("h3",{id:"case-1-share-states-between-sibling-components"},"Case 1: Share States Between Sibling Components"),(0,i.kt)("p",null,"React can pass state into child components easily. But if you'd like to share states between sibling components, normally you will have to:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"create the state in your parent component"),(0,i.kt)("li",{parentName:"ul"},"pass the value down as props into child components"),(0,i.kt)("li",{parentName:"ul"},"pass the setter function down as props into child components if child components need to modify them")),(0,i.kt)("h3",{id:"case-2-share-states-between-deeply-nested-components"},"Case 2: Share States Between Deeply Nested Components"),(0,i.kt)("p",null,"When things come to deeply nested components, it's getting worse. "),(0,i.kt)("p",null,"If you'd like to share states between some deeply nested components, you normally has two options:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Use ",(0,i.kt)("inlineCode",{parentName:"li"},"React Context"),". Not that trivial, the rough steps looks like this:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Create a context via ",(0,i.kt)("inlineCode",{parentName:"li"},"React.createContext()")),(0,i.kt)("li",{parentName:"ul"},"Create ",(0,i.kt)("inlineCode",{parentName:"li"},"Provider")," component, wrap the ",(0,i.kt)("inlineCode",{parentName:"li"},"Context.Provider")," "),(0,i.kt)("li",{parentName:"ul"},"Put the state you'd like to share into the created ",(0,i.kt)("inlineCode",{parentName:"li"},"Provider")),(0,i.kt)("li",{parentName:"ul"},"Export your context instance. For the components who'd like to access the shared state, import it and call ",(0,i.kt)("inlineCode",{parentName:"li"},"useContext"),"."),(0,i.kt)("li",{parentName:"ul"},"BTW, if you'd like to modify the state from child components, normally you will need to create a separated Context!"))),(0,i.kt)("li",{parentName:"ul"},"Or, you might choose to use another ",(0,i.kt)("inlineCode",{parentName:"li"},"state management library")," such as ",(0,i.kt)("inlineCode",{parentName:"li"},"Redux"),", that brings another layers of complexity.")),(0,i.kt)("h3",{id:"case-3-notify-child-component-about-some-events"},"Case 3: Notify Child Component About Some Events"),(0,i.kt)("p",null,"When child component wants to notify parent component about some events, it can be easily achieved by passing a ",(0,i.kt)("inlineCode",{parentName:"p"},"callback")," props. But in the reverse direction, it's not easy at all."),(0,i.kt)("p",null,"To notify child component about some events, you have two approaches:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Use a props to emulate an event. ",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"You create a state to represent the event, and pass it to your child component. "),(0,i.kt)("li",{parentName:"ul"},"When the event happens, you perform a ",(0,i.kt)("inlineCode",{parentName:"li"},"setState")," and then the child compnent will receive the event as props."),(0,i.kt)("li",{parentName:"ul"},"However, since it's a props actually, so you need to provide a way to revert the state back so the child component can recognize it when the event re-occurs."))),(0,i.kt)("li",{parentName:"ul"},"Use a React Ref.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"In your child component, wrap it with ",(0,i.kt)("inlineCode",{parentName:"li"},"forwardRef")," if you're using function component (which you should!)"),(0,i.kt)("li",{parentName:"ul"},"In your child component, set the event handler funciton into your ",(0,i.kt)("inlineCode",{parentName:"li"},"<your-ref>.current"),"."),(0,i.kt)("li",{parentName:"ul"},"In your parent component, create a ref via ",(0,i.kt)("inlineCode",{parentName:"li"},"useRef")," and pass it into your child component.")))),(0,i.kt)("h2",{id:"thats-why-you-might-want-to-use-reconnectjs"},"That's why you might want to use Reconnect.js!"),(0,i.kt)("p",null,"Let's see a quick demo:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"import React from 'react';\nimport {useOutlet} from 'reconnect.js';\n\nfunction App() {\n  useOutlet('add', 0); // <-- create an outlet called 'add', with initial value 0\n\n  return (\n    <div style={{padding: 10}}>\n      <Value />\n      <div>\n        <Add />\n        <Sub />\n      </div>\n    </div>\n  );\n}\n\nfunction Value() {\n  const [value] = useOutlet('add'); // <-- access the value from the outlet\n  return <h1>{value}</h1>;\n}\n\nfunction Add() {\n  const [value, setValue] = useOutlet('add'); // <-- access both the value and modifier from the outlet\n  return <button onClick={() => setValue(value + 1)}>+1</button>;\n}\n\nfunction Sub() {\n  const [value, setValue] = useOutlet('add'); // <-- access both the value and modifier from the outlet\n  return <button onClick={() => setValue(value - 1)}>-1</button>;\n}\n\nexport default App;\n")))}c.isMDXComponent=!0}}]);