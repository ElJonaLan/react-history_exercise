import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokes = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getJokes() {
      let jokesArr = [...jokes];
      let seenJokes = new Set();

      try {
        while (jokesArr.length < numJokes) {
          let response = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { ...jokeObj } = response.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            jokesArr.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        setJokes(jokesArr);
        setIsLoading(false);
      } catch (err) {
        alert(err);
      }
    }

    if (jokes.length === 0) {
      getJokes();
    }
  }, [jokes, numJokes]);

  const getNewJokes = () => {
    setJokes([]);
    setIsLoading(true);
  };

  const vote = (id, delta) => {
    setJokes((allJokes) =>
      allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={getNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(({ joke, id, votes }) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
};

export default JokeList;
