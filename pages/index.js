import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { degToCompass, convertTime, ctoF, mpsToMph, kmToM, timeToAMPM, isPM } from '../utilities/utils.js'; //utlity file.

export default function Home() {
  const [input, setInput] = useState("Chennai"); // default city
  const [systemUsed, setSystemUsed] = useState("metric"); // default system
  const [weatherData, setWeatherData] = useState();

  // function to get weather data.
  const getData = async () => {
    const res = await fetch("api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();

    setWeatherData({ ...data });
    setInput("");
  };

  // function to capture the city input.
  const enterKeydown = (event) => {
    if (event.keyCode === 13) {
      getData();
    }
  };

  useEffect(() => {
    getData();
  });

  

  const changeSystem = () =>
    systemUsed == "metric"
      ? setSystemUsed("imperial")
      : setSystemUsed("metric");

  var weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return weatherData && !weatherData.message ? (
    <div className={styles.wrapper}>
      <div className={styles.weatherWrapper}>
        <h1 className={styles.locationTitle}>
          {weatherData.name}, {weatherData.sys.country}
        </h1>

        <p className={styles.weatherDescription}>
          {weatherData.weather[0].description}
        </p>
        <Image
          alt="weatherIcon"
          src={`/icons/${weatherData.weather[0].icon}.svg`}
          height="300px"
          width="300px"
        />

        <h1 className={styles.mainTemp}>
          {systemUsed == "metric"
            ? Math.round(weatherData.main.temp)
            : Math.round(ctoF(weatherData.main.temp))}
          °{systemUsed == "metric" ? "C" : "F"}
        </h1>
        <p>
          Feels like{" "}
          {systemUsed == "metric"
            ? Math.round(weatherData.main.feels_like)
            : Math.round(ctoF(weatherData.main.feels_like))}
          °{systemUsed == "metric" ? "C" : "F"}
        </p>
      </div>

      <div className={styles.statsWrapper}>
        <div className={styles.titleAndSearch}>
          <h2 style={{ textAlign: "left" }}>
            {
              weekday[
                new Date(
                  convertTime(weatherData.dt, weatherData.timezone).input
                ).getUTCDay()
              ]
            }
            ,{" "}
            {systemUsed == "metric"
              ? parseInt(
                  convertTime(weatherData.dt, weatherData.timezone)[0].split(
                    ":"
                  )[0]
                )
              : timeToAMPM(
                  convertTime(weatherData.dt, weatherData.timezone)[0]
                ).split(":")[0]}
            :00{" "}
            {systemUsed == "imperial"
              ? isPM(convertTime(weatherData.dt, weatherData.timezone)[0])
              : ""}
          </h2>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search a city..."
            value={input}
            onFocus={(e) => {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              enterKeydown(e);
              e.target.placeholder = "Search a city...";
            }}
          />
        </div>

        <div className={styles.statsBox}>
          <div className={styles.statsCard}>
            <p>Humidity</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/025-humidity.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>{weatherData.main.humidity}</h1>
                <p>%</p>
              </div>
            </div>
          </div>
          <div className={styles.statsCard}>
            <p>Wind speed</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/017-wind.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>
                  {systemUsed == "metric"
                    ? weatherData.wind.speed
                    : mpsToMph(weatherData.wind.speed)}
                </h1>
                <p>{systemUsed == "metric" ? "m/s" : "m/h"}</p>
              </div>
            </div>
          </div>
          <div className={styles.statsCard}>
            <p>Wind direction</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/014-compass.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>{degToCompass(weatherData.wind.deg)}</h1>
              </div>
            </div>
          </div>
          <div className={styles.statsCard}>
            <p>Visibility</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/binocular.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>
                  {systemUsed == "metric"
                    ? (weatherData.visibility / 1000).toPrecision(2)
                    : kmToM(weatherData.visibility / 1000)}
                </h1>
                <p>{systemUsed == "metric" ? "km" : "miles"}</p>
              </div>
            </div>
          </div>
          <div className={styles.statsCard}>
            <p>Sunrise</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/040-sunrise.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>
                  {systemUsed == "metric"
                    ? `${parseInt(
                        convertTime(
                          weatherData.sys.sunrise,
                          weatherData.timezone
                        )[0].split(":")[0]
                      )}:${
                        convertTime(
                          weatherData.sys.sunrise,
                          weatherData.timezone
                        )[0].split(":")[1]
                      }`
                    : timeToAMPM(
                        convertTime(
                          weatherData.sys.sunrise,
                          weatherData.timezone
                        )[0]
                      )}
                </h1>
                <p>
                  {systemUsed == "imperial"
                    ? isPM(
                        convertTime(
                          weatherData.sys.sunrise,
                          weatherData.timezone
                        )[0]
                      )
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.statsCard}>
            <p>Sunset</p>
            <div className={styles.statsCardContent}>
              <Image
                alt="weatherIcon"
                src={`/icons/041-sunset.png`}
                height="100px"
                width="100px"
              />
              <div>
                <h1>
                  {systemUsed == "metric"
                    ? convertTime(
                        weatherData.sys.sunset,
                        weatherData.timezone
                      )[0]
                    : timeToAMPM(
                        convertTime(
                          weatherData.sys.sunset,
                          weatherData.timezone
                        )[0]
                      )}
                </h1>
                <p>
                  {systemUsed == "imperial"
                    ? isPM(
                        convertTime(
                          weatherData.sys.sunset,
                          weatherData.timezone
                        )[0]
                      )
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.switchBox}>
          <p
            className={styles.switch}
            style={{ color: systemUsed == "metric" ? "green" : "black" }}
            onClick={changeSystem}
          >
            Metric System
          </p>
          <p
            className={styles.switch}
            style={{ color: systemUsed == "metric" ? "black" : "green" }}
            onClick={changeSystem}
          >
            Imperial System
          </p>
        </div>
      </div>
    </div>
  ) : weatherData && weatherData.message ? (
    <div className={styles.errScr}>
      <div>
        <h1 style={{ marginBottom: "30px" }}>City not found, try again!</h1>
        <input
          type="text"
          className={styles.searchInput}
          onFocus={(e) => (e.target.value = "")}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => enterKeydown(e)}
        />
      </div>
    </div>
  ) : (
    <div className={styles.errScr}>
      <h1>Loading data...</h1>
    </div>
  );
}