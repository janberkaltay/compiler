import React, { useState } from 'react';
import './App.css';

function lexer(input) {
  const tokens = [];
  let current = 0;

  while (current < input.length) {
    let char = input[current];

    if (char === '!') {
      tokens.push({
        type: 'END_OP',
        value: '!'
      });
      current++;
      continue;
    }

    let value = '';
    while (char && char !== '!') {
      value += char;
      char = input[++current];
    }

    tokens.push({
      type: 'STRING',
      value: value
    });
  }

  return tokens;
}

function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === 'STRING') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value
      };
    }

    if (token.type === 'END_OP') {
      current++;
      return {
        type: 'EndOperator',
        value: token.value
      };
    }

    throw new TypeError('Unknown token type: ' + token.type);
  }

  const ast = {
    type: 'Program',
    body: []
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('');
    case 'StringLiteral':
      return node.value.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
    case 'EndOperator':
      return '';
    default:
      throw new TypeError('Unknown node type: ' + node.type);
  }
}

function binaryToString(binary) {
  return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function compiler(input) {
  if (/^[01\s]+!$/.test(input.trim())) {
    return binaryToString(input.trim().slice(0, -1));
  } else {
    const tokens = lexer(input);
    const ast = parser(tokens);
    return codeGenerator(ast);
  }
}

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCompile = () => {
    if (input.trim().length === 0) {
      setError('Input cannot be empty.');
      setOutput('');
    } else if (!/^[01\s]+!$/.test(input) && !input.endsWith('!')) {
      setError('Invalid login! Finally entered "!" must be.');
      setOutput('');
    } else {
      const binaryOutput = compiler(input);
      setOutput(binaryOutput);
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCompile();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>String and Binary Converter</h1>
        <div className="input-container">
          <label htmlFor="input">Please enter a string or binary number (must have a '!' at the end)</label>
          <input
            id="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button onClick={handleCompile}>Convert</button>
        {output && (
          <div>
            <h2>Output:</h2>
            <p>{output}</p>
          </div>
        )}
        {error && (
          <div className="error">
            <h2>{error}</h2>
          </div>
        )}
        <div className='dev'>
      &copy; 2024 Powered by 
                    <a href="http://www.janberkaltay.dev" target="_blank" rel="noopener noreferrer"> Janberk Altay</a>  
                </div>
      </header>
    </div>
  );
}

export default App;
