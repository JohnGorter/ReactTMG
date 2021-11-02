const [userText, setUserText] = useState("");
const handleUserKeyPress = event => {
    const { key, keyCode } = event;

    if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90)) {
       setUserText(prevUserText => `${prevUserText}${key}`);
    }
  };

useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
        window.removeEventListener("keydown", handleUserKeyPress);
    };
}, []);

  return (
      <div>
          <h1>Feel free to type!</h1>
          <blockquote>{userText}</blockquote>
      </div>
  );