# Lab Hooks
Time: 30 minutes

# Excercise 1. Create a new React Redux Application
use the following code to generate a new React Redux application
```
npx create-react-app hooks-excercise
```

Add a component that listens to keystrokes, using the effectHook. 
Each time you press a key, the component needs to update the text in the blockquote.
So you have to listen for keystrokes on the window and process them accordingly.

The component is coded like this:
```
const MyInput = () => {
  const [userText, setUserText] = useState('');
  useEffect(() => {
    // your code here...
  });

  return (
    <div>
      <h1>Feel free to type!</h1>
      <blockquote>{userText}</blockquote>
    </div>
  );
}
```

# Excercise 2. Make it better
If you did the last excercise well, it should work. But how many times are the eventListeners
attached to the component? Every render?

Try to log the event listerer additions and removals to check how often this occurs.

Improve the solution so the addition and removal of these listeners are done only once.
Of course the code should still work.





