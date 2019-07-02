import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';

import './App.css';

const ListTodos = `
  query {
    listTodos {
      items {
        id name description completed
      }
    }
  }
`

function App() {
  const [signUpStep, setSignUpStep] = useState(0);
  const [username, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [authenticationCode, setAuthenticationCode] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getToDos = async () => {
      const todoData = await API.graphql(graphqlOperation(ListTodos));
      setTodos(todoData.data.listTodos.items);
    }

    getToDos();
  }, []);

  const signUp = async () => {
    try {
      const resp = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          phone_number,
        }
      });
      console.log('Sign up successful', resp);
      setSignUpStep(1);
    } catch (ex) {
      console.log('Sign up failed', ex);
    }
  }

  const confirmSignUp = async () => {
    try {
      const resp = await Auth.confirmSignUp(username, authenticationCode);
      console.log('Sign up successful', resp);
    } catch (ex) {
      console.log('Confirm sign up failed', ex);
    }
  }

  return (
    <div className="App">
      <ul>
        {
          todos.map((todo, i) => (
            <li key={i}><h2>{todo.name}</h2> <p>{todo.description}</p></li>
          ))
        }
      </ul>
      {signUpStep === 0 && (
        <>
          <input type="text" name="username" placeholder="Username - email" onChange={e => setuserName(e.target.value)} />
          <input type="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <input type="email" name="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} />
          <input name="phone_number" placeholder="Phone Number" onChange={e => setPhoneNumber(e.target.value)} />
          <button onClick={signUp}>Sign up</button>
        </>
      )}
      {signUpStep === 1 && (
        <>
          <input type="text" name="username" placeholder="Username - email" onChange={e => setuserName(e.target.value)} />
          <input type="text" name="authenticationCode" placeholder="Authentication Code" onChange={e => setAuthenticationCode(e.target.value)} />
          <button onClick={confirmSignUp}>Confirm sign up</button>
        </>
      )}
    </div>
  );
}

export default App;

