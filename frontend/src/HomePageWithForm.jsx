import { useEffect, useState } from "react";
import "./App.css";
import {
  exitSlot,
  fetchParkingSlotsData,
  reassignParkingSlot,
  requestForParkingSlot,
} from "./api/parkingSlots";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function HomePageWithForm() {
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    customer_type: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState("User");

  const [sourceSlot, setSourceSlot] = useState(null); // clicked occupied slot (VIP)
  const [targetSlot, setTargetSlot] = useState(null); // clicked empty slot

  const queryClient = useQueryClient();

  const { data: parkingSlotsData = [], refetch } = useQuery({
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

  const { mutate: reassignSlotMutation } = useMutation({
    mutationFn: reassignParkingSlot,
    onSuccess: (data) => {
      console.log("Reassigned", data);
      refetch();
      // queryClient.invalidateQueries(["fetchParkingSlots"]);
      toast.success("VIP slot re-assigned successfully!");
      setSourceSlot(null);
      // setTargetSlot(null);
    },
    onError: () => {
      toast.error("Something went wrong while reassigning.");
      setSourceSlot(null);
      // setTargetSlot(null);
    },
  });

  const {
    mutate: requestParkingSlotsMutation,
    isPending,
    isError: isSubmitError,
    isSuccess,
  } = useMutation({
    mutationFn: requestForParkingSlot,
    onSuccess: (data) => {
      // Invalidate cache after success
      console.log("Data inside onSuccess mutation", data);
      if (data === "No available slot found") {
        toast.success("No available slot found!");
      } else {
        toast.success("Parking slot alloted successfully!");
      }

      queryClient.invalidateQueries(["fetchParkingSlots"]);
      setIsSubmitting(false);
    },
    onError: () => {
      toast.success("Something went wrong while alloting slot!");
      setIsSubmitting(false);
    },
  });

  const { mutate: emptySlotMutation } = useMutation({
    mutationFn: exitSlot,
    onSuccess: (data) => {
      toast.success(data.message || "Slot emptied!");
      queryClient.invalidateQueries(["fetchParkingSlots"]);
    },
    onError: () => {
      toast.error("Failed to empty the slot.");
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
          toast.success("You are now an Admin!");
          setUserRole(e.target.value);
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
                <div className="slotContainer" key={slot.slot_id}>
                  {userRole === "Admin" && slot.is_occupied && (
                    <span
                      className="deleteButton"
                      onClick={() => {
                        emptySlotMutation(slot.vehicle_number);
                      }}
                    >
                      x
                    </span>
                  )}

                  <div
                    className="slot"
                    style={{
                      ...(slot.is_occupied && {
                        backgroundColor: "#007bff",
                        color: "#fff",
                      }),
                      ...(sourceSlot?.slot_id === slot?.slot_id && {
                        border: "3px dotted #000",
                      }),
                    }}
                    onClick={() => {
                      if (userRole === "Admin") {
                        if (slot.is_occupied && slot.customer_type === "VIP") {
                          setSourceSlot(slot);
                          toast.success("Please select target slot");
                        } else if (!slot.is_occupied && sourceSlot) {
                          console.log("Target slot", slot);
                          setTargetSlot(slot);
                          reassignSlotMutation({
                            from_slot_id: sourceSlot.slot_id,
                            to_slot_id: slot.slot_id,
                            vehicle_number: sourceSlot.vehicle_number,
                          });
                        }
                      }
                    }}
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
                <div className="slotContainer" key={slot.slot_id}>
                  {userRole === "Admin" && slot.is_occupied && (
                    <span
                      className="deleteButton"
                      onClick={() => {
                        emptySlotMutation(slot.vehicle_number);
                      }}
                    >
                      x
                    </span>
                  )}
                  <div
                    className="slot"
                    style={{
                      ...(slot.is_occupied && {
                        backgroundColor: "#007bff",
                        color: "#fff",
                      }),
                      ...(sourceSlot?.slot_id === slot?.slot_id && {
                        border: "3px dotted #000",
                      }),
                    }}
                    onClick={() => {
                      if (userRole === "Admin") {
                        if (slot.is_occupied && slot.customer_type === "VIP") {
                          setSourceSlot(slot);
                          toast.success("Please select target slot");
                        } else if (!slot.is_occupied && sourceSlot) {
                          setTargetSlot(slot);
                          reassignSlotMutation({
                            from_slot_id: sourceSlot.slot_id,
                            to_slot_id: slot.slot_id,
                            vehicle_number: sourceSlot.vehicle_number,
                          });
                        }
                      }
                    }}
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
