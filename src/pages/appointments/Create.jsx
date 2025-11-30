import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialisation: ""
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
      data: form
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/appointments", { state: {
        type: "success",
        message: `Appointment "${response.data.first_name} ${response.data.last_name}" created successfully`} });
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
          placeholder="First name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <Input
          className="mt-3"
          type="text"
          placeholder="Last name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />

        <Input
          className="mt-3"
          type="text"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          className="mt-3"
          type="text"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Input
          className="mt-3"
          type="text"
          placeholder="Specialisation"
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
