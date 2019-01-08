# Advanced Rendering

---

## Aside: expressions in JSX

Inside JSX we can embed _any_ valid JavaScript expression.

    () => <div>{ 40 + 2 }</div>

    const answerToQuestionOfLife = 42;
    () => <div>{ answerToQuestionOfLife }</div>
    
    const askQuestionOfLife = () => answerToQuestionOfLife;
    () => <div>{ askQuestionOfLife() }</div>

---

## Aside: expressions in JSX (2)

JSX itself is an expression, too.
So you can embed control statements inside JSX:

    class Mood extends React.Component {
        render() {
            if (this.props.isHappy) {
                return <ClapHands />; 
            } else {
                return <DryTears />;
            }
        }
    }
---

## Aside: expressions in JSX (3)

JSX itself is an expression, too.
So you can embed control statements inside JSX:

    const Ticker = (props) => <div>Ticker for <strong>{ props.symbol }</strong></div>;

    class TickerList extends React.Component {
        render() {
            return this.props.symbols.map(
                (symbol) => <Ticker symbol={ symbol } />
            );
        }
    }

    <TickerList symbols={ ["ASML", "PHIA"] } />

---

## Under the hood: Virtual DOM

* So far, we've _declared_ components & elements
* Which are _transpiled_ into `React.createElement(...)` calls:


    <Greeter name={ 'world' } />

    /** transpiles into */
    
    React.createElement(Greeter, { name: 'world' }, null)

* React "automagically" (re-) builds the DOM using its **virtual DOM**.
    * Lives in-memory.
    * Shadows the **actual DOM**.

---

## Under the hood: Reconciliation (1)

* It's Reacts job to keep the **virtual** DOM and the **actual** DOM in sync.
* This _reconciliation_ makes two important assumptions:
    1. If two elements are of different type, the (sub) tree will be different.
    1. The `key` prop identifies child elements over re-renders.
* Do these assumptions make sense to you?

---

## Under the hood: Reconciliation (2)

If two elements are of different type, the (sub) tree will be different.

    const FrenchGreeter = ({ name }) => <div>Salut, { name }</div>;
    const GermanGreeter = ({ name }) => <div>Hallo, { name }</div>;
    const EnglishGreeter = ({ name }) => <div>Hello, { name }</div>;

    const App = ({ language, name }) => {
        switch(language) {
            case 'fr': return <FrenchGreeter name={ name } />
            case 'de': return <GermanGreeter name={ name } />
            case 'en':
            default  : return <EnglishGreeter name={ name } />
        }
    };

---

## Under the hood: Reconciliation (2)

The `key` prop identifies child elements over re-renders.

    const TickerList = ({ symbols }) => symbols.map(
        (symbol) => <Ticker symbol={ symbol } />
    );

    const symbols = ["ASML", "PHIA"];
    <TickerList symbols={ symbols } />

* A new symbol is added to the array. How does React know which elements in the **virtual** DOM are new compared to the **actual** DOM?


    const TickerList = ({ symbols }) => symbols.map(
        (symbol) => <Ticker key={ symbol } symbol={ symbol } />
    );

* The `key` can be anything, as long as it's **stable**.
