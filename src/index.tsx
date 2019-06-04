import * as React from "react";
import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";

/**
Input:
    hello world bob yay hello
    hello
Output:
    *hello* world bob yay *hello*
**/
function FormatText({ text }: { text: string }): JSX.Element {
  const [spacedText, setspacedText] = useState<string>("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  // use useEffect to make stateful changes to a react component
  useEffect(() => {
    // wrapped async inside sync fn as crappy workaround
    const fetchData = async () => {
      const spacedText = await doMecabFetch({ body: text });
      setspacedText(spacedText);
    };
    fetchData();
  });

  const words = spacedText.split(" ");
  const output = words
    .map((word, idx) =>
      word === highlighted ? (
        <mark key={idx}>{word}</mark>
      ) : (
        <text key={idx} onMouseOver={() => setHighlighted(word)}>
          {word}
        </text>
      )
    )
    .reduce((prev: (JSX.Element | string)[], curr: JSX.Element | string) => {
      prev.push(curr);
      prev.push(" ");
      return prev;
    }, []);
  return <div>{output}</div>;
}

async function doMecabFetch(text_input: { body: string }): Promise<string> {
  let url = "spacing";

  let res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(text_input)
  })
    .then(response => {
      // unwrap promise by 1 level
      return response.json();
    })
    .then(json => {
      console.log(json);
      return json;
    })
    .catch(error => {
      console.log(error);
      return "";
    });
  return res;
}

function JSXButton(): JSX.Element {
  // A button class to test the fetch API

  // wtf is this
  let text_input = { body: "蒼い風がいま" };
  return <button onClick={() => doMecabFetch(text_input)}>Click me</button>;
}

function App({}) {
  let s: string = "foo";
  const [text, setText] = useState(s);

  return (
    <div id="app-mini">
      <textarea onChange={e => setText(e.target.value)} value={text} />
      <FormatText text={text} />
      <JSXButton />
    </div>
  );
}
const appdiv = document.getElementById("app");

ReactDOM.render(<App />, appdiv);
