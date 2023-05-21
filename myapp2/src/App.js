
import OperationButton from './components/OperationButton';
import DigitButton from './components/DigitButton';
import { useReducer } from 'react';
import './App.css'
export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose_operation',
  DELETE: 'delete',
  CALCULATE: 'calculate'
}

function reducer(state,{type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          //this if statement will be activated if there is result present on the display and we type a number then the result should be removed and operand should be added....if we do not use this input operand will be concate with the result
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state;
      if(payload.digit === "." && state.currentOperand.includes(".")) return state;
      return{
      ...state,
      currentOperand: `${state.currentOperand || ""}${payload.digit}`,
    }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){return state}
      if(state.currentOperand == null){
        //if we have selected a wrong operation and we wants to change is that would not be possible without this function
        return{
          ...state,
          operation: payload.operation,
        }
      }
      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
        }
      return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
      }
   
      case ACTIONS.CLEAR:
        return {};
      case ACTIONS.DELETE:
          if(state.overwrite){
            return{
              ...state,
              overwrite: false,
              currentOperand: null, 
            }}
            if(state.currentOperand == null){return state}
            if(state.currentOperand.length === 1){
              return {
                ...state,
                currentOperand: null
              }}
            return{
              ...state,
              currentOperand: state.currentOperand.slice(0 ,-1)
            }
      case ACTIONS.CALCULATE:
        if(state.operation == null || state.previousOperand == null || state.currentOperand == null)
        {
          return state;
        }
        return{
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }
    default:
      break;
  }

}
function evaluate({currentOperand, previousOperand,operation}){
     const previous = parseFloat(previousOperand)
     const current = parseFloat(currentOperand)
     if(isNaN(previous) || isNaN(current)){return ""}
     let computation = ""
     switch (operation){
      case "+":
        computation = previous + current
        break;
      case "-":
        computation = previous - current
        break;
      case "*":
        computation = previous * current
        break;
      case "/":
        computation = previous / current
        break;
      
     }
     return computation.toString()

}
const initialState = {
  currentOperand: "",
  previousOperand: null,
  operation: null,
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})
function formatOperand(operand){
  if(operand == null) return
  const [ interger, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(interger)
  return `${INTEGER_FORMATTER.format(interger)}.${decimal}`
  
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className="calculator_grid">
        <div className="output">
          <div className="previous_operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current_operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span_two">%</button>
        <button className="span_two">SI</button>
        <button className="span_two" onClick={()=>dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button  onClick={()=>dispatch({type: ACTIONS.DELETE})}>DEL</button>
         
           <OperationButton operation="/" dispatch={dispatch} />
           

           <DigitButton digit="1" dispatch={dispatch} />
           <DigitButton digit="2" dispatch={dispatch} />
           <DigitButton digit="3" dispatch={dispatch} />
           <OperationButton operation="*" dispatch={dispatch} />

           <DigitButton digit="4" dispatch={dispatch} />
           <DigitButton digit="5" dispatch={dispatch} />
           <DigitButton digit="6" dispatch={dispatch} />
           <OperationButton operation="+" dispatch={dispatch} />

           <DigitButton digit="7" dispatch={dispatch} />
           <DigitButton digit="8" dispatch={dispatch} />
           <DigitButton digit="9" dispatch={dispatch} />
           <OperationButton operation="-" dispatch={dispatch} />

         
           <DigitButton digit="." dispatch={dispatch} />
           <DigitButton digit="0" dispatch={dispatch} />
           <button className="span_two" onClick={()=>dispatch({type: ACTIONS.CALCULATE})}>=</button>
         
           
        
    </div>
  );
}

export default App;
