import React from 'react';
import {GlobalContext} from 'rev-component-kit';

const Context = React.createContext();


let actions = null;

function Provider(props) {
  const [appData, setAppData] = React.useState(null);
  actions = {
    appLogicAction: () => 0
  }

  return (
    <Context.Provider
      value={{
        appData,
        actions,
        globalActions: GlobalContext.Actions
      }}>
      <GlobalContext.Provider
        renderToast={GlobalToast}
        renderActivityIndicator={GlobalSpinner}
        renderError={GlobalErrorDisplay}>
        {props.children}
      </GlobalContext.Provider>
    </Context.Provider>
  )
}


function GlobalSpinner() {
  return <div style={{padding: 20, backgroundColor: 'pink'}}>Loading...</div>;
}

function GlobalToast(content) {
  return <div style={{color: "red", background: "green", padding: 50}}>{content}</div>
}

function GlobalErrorDisplay() {
  return <div style={{padding: 20, color: 'red'}}>Customized error UI</div>;
}

export {
  Provider,
  Context,
  actions as Actions,
}