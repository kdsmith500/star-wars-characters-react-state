import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import './styles.scss';
import endpoint from './endpoint';

const initialState = {
  result: null,
  loading: true,
  error: null
}

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      result: null,
      loading: true,
      error: null
    }
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      result: action.payload.response,
      loading: false,
      error: null
    }
  }

  if (action.type === 'ERROR') {
    return {
      result: null,
      loading: false,
      error: action.payload.error
    }
  }

  return state;
}

const useFetch = url => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => { // cant be made async but can contain an async function to be called if using promises is a problem
    dispatch({ type: 'LOADING' });

    fetch(endpoint + '/characters')
      .then(response => response.json())
      .then(response => {
        dispatch({ type: 'RESPONSE_COMPLETE', payload: { response } });
      })
      .catch(error => {
        dispatch({ type: 'ERROR', payload: { error } });
      });
    }, []);

    return [state.result, state.loading, state.error];
}

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || []; // keeps code from breaking when null

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
