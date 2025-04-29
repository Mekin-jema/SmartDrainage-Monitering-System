const here = {
  apiKey: "6ZKCmRwks4GRrsbzUG3Mey-Nq_eoGNklO7m13osVzmU", // Replace with your HERE API key
  trafficApiUrl: `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:28.5246,40.8021,29.4320,41.1999&apiKey=6ZKCmRwks4GRrsbzUG3Mey-Nq_eoGNklO7m13osVzmU`,
};
const fetchTrafficData = async () => {
  //   setLoading(true);
  try {
    const response = await fetch(here.trafficApiUrl);
    const data = await response.json();
    return data;
    // setTrafficData(data);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
  } finally {
    // setLoading(false);
  }
};

export default fetchTrafficData;
