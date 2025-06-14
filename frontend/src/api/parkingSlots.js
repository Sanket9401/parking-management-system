import axios from 'axios'

//This functions fetches all parking slots data
export const fetchParkingSlotsData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/get-all-slots");
    return res.data; // assuming response is an array of slots

  } catch (error) {
    console.log("Error while fetching parking slots data:", error)
  }
};

//This function is used to request parking slot 
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

    const response = await axios.request(config);
    console.log("Response from backend:", response.data);
    return response.data;

    // return response.data

  } catch (error) {
    console.log("Error while allocating parking slot")
  }
}

//This function is used when vehicle goes out from parking slot
export const exitSlot = async (vehicle_number) => {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/exit-slot',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { vehicle_number: vehicle_number }
    };

    const response = await axios.request(config)
    return response.data

  } catch (error) {

  }
}

//This function reassigns slot for VIP/emergency customer type
export const reassignParkingSlot = async (data) => {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/reassign-slot',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data

  } catch (error) {
    console.log("Error while re-assigning parking slot")

  }
}