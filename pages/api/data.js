//Export function for the data module
// Here the API_KEY is defined and hidden for Public view.
// The key is defined in the env file.
export default async function handler(req, res) {
  const { input } = req.body;
  const getWeatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
  );
  const data = await getWeatherData.json();
  res.status(200).json(data);
}
