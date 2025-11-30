import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";


export default function Edit() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialisation: "",
  });
  const { token } = useAuth();


  useEffect(() => {
    const fetchAppointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);

        let appointment = response.data;

        setForm({first_name: appointment.first_name,
                 last_name: appointment.last_name,
                 email: appointment.email,
                 phone: appointment.phone,
                 specialisation: appointment.specialisation
                });
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointment();

    console.log("Hi");
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateAppointment = async () => {
    const options = {
      method: "PATCH",
      url: `/appointments/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/appointments");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateAppointment();
  };

  return (
    <>
      Update a Appointment
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First Name"
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
