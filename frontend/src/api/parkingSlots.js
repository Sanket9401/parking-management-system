import axios from 'axios'

export const fetchParkingSlotsData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/get-all-slots");
    return res.data; // assuming response is an array of slots

  } catch (error) {
    console.log("Error while fetching parking slots data:", error)
  }
};

export const requestForParkingSlot = async (formData) => {
  try {

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/request-slot',
      headers: {
        'Content-Type': 'application/json'
      },
      data: formData
    };

    await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data
      })

  } catch (error) {
    console.log("Error while allocating parking slot")
  }
}