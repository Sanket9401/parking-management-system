import { useEffect, useState } from "react";
import "./App.css";
import {
  fetchParkingSlotsData,
  requestForParkingSlot,
} from "./api/parkingSlots";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function HomePageWithForm() {
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    customer_type: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState("User");
  const [loggedInWithAdmin, setloggedInWithAdmin] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: parkingSlotsData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchParkingSlots"],
    queryFn: fetchParkingSlotsData,
  });

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    console.log(value, name);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const {
    mutate: requestParkingSlotsMutation,
    isPending,
    isError: isSubmitError,
    isSuccess,
  } = useMutation({
    mutationFn: requestForParkingSlot,
    onSuccess: () => {
      // Invalidate cache after success
      queryClient.invalidateQueries(["fetchParkingSlots"]);
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleOnSubmit = (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    console.log("CAlling API");
    requestParkingSlotsMutation({
      vehicle_number: formData.vehicle_number,
      vehicle_type: formData.vehicle_type.toLowerCase(),
      customer_type:
        formData.customer_type === "VIP/emergency" ? "VIP" : "regular",
    });
    setFormData({
      vehicle_number: "",
      vehicle_type: "",
      customer_type: "",
    });
  };

  return (
    <>
      <select
        value={userRole}
        className="selectRoleInput"
        onChange={(e) => {
          setUserRole(e.target.value);
          if (e.target.value === "Admin") {
            setloggedInWithAdmin(true);
          }
        }}
      >
        {["User", "Admin"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="parkingSlotsWrapper">
        <p className="liveStatusText">Live Status</p>
        <div className="levelOneWrapper">
          <p className="levelNumberText">Level 1:</p>
          <div className="slotsWrapper">
            {parkingSlotsData
              ?.filter((slot) => slot.level === "L1")
              .map((slot) => (
                <div className="slotContainer">
                  <div
                    key={slot.slot_id}
                    className="slot"
                    style={
                      slot.is_occupied
                        ? { backgroundColor: "#007bff", color: "#fff" }
                        : null
                    }
                  >
                    {slot.slot_id}
                  </div>
                  <p className="slotCustomerType">
                    {slot.is_occupied
                      ? ["VIP", "emergency"].includes(slot.customer_type)
                        ? slot.customer_type
                        : "R"
                      : null}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="levelTwoWrapper">
          <p className="levelNumberText">Level 2:</p>
          <div className="slotsWrapper">
            {parkingSlotsData
              .filter((slot) => slot.level === "L2")
              .map((slot) => (
                <div className="slotContainer">
                  <div
                    key={slot.slot_id}
                    className="slot"
                    style={
                      slot.is_occupied
                        ? { backgroundColor: "#007bff", color: "#fff" }
                        : null
                    }
                  >
                    {slot.slot_id}
                  </div>
                  <p className="slotCustomerType">
                    {slot.is_occupied
                      ? ["VIP", "emergency"].includes(slot.customer_type)
                        ? "VIP"
                        : "R"
                      : null}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="formWrapper">
        <div className="headerContainer">
          <h2>Request Parking Slot</h2>
        </div>
        <form
          className="formContainer"
          onSubmit={(e) => {
            handleOnSubmit(e);
          }}
        >
          <input
            type="text"
            value={formData.vehicle_number}
            className="input"
            id="vehicle_number"
            name="vehicle_number"
            placeholder="Vehicle Number"
            onChange={(e) => {
              handleOnChange(e);
            }}
          />
          <select
            value={formData.vehicle_type}
            className="selectInput"
            onChange={(e) => {
              setFormData({
                ...formData,
                vehicle_type: e.target.value,
              });
            }}
          >
            {["Vehicle Type", "small", "medium", "large"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={formData.customer_type}
            className="selectInput"
            onChange={(e) => {
              setFormData({
                ...formData,
                customer_type: e.target.value,
              });
            }}
          >
            {["Customer Type", "VIP/emergency", "Regular"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button>{isSubmitting ? "Please wait..." : "Submit"}</button>
        </form>
      </div>
    </>
  );
}

export default HomePageWithForm;
