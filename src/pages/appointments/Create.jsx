import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
  const [form, setForm] = useState({
    appointment_date: "",
    doctor_id: "",
    patient_id: ""
  });
  
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createAppointment = async () => {
    const options = {
      method: "POST",
      url: `/appointments`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        appointment_date: form.appointment_date,
        doctor_id: parseInt(form.doctor_id),
        patient_id: parseInt(form.patient_id)
      }
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/appointments", { state: {
        type: "success",
        message: `Appointment "${response.data.appointment_date}" created successfully`} });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    createAppointment();
  };

  return (
    <>
      Create Appointment
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Date of Appointment"
          name="appointment_date"
          value={form.appointment_date}
          onChange={handleChange}
        />
        <Input
          className="mt-3"
          type="number"
          placeholder="Doctor Number"
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
        />

        <Input
          className="mt-3"
          type="number"
          placeholder="Patient Number"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
