import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Create() {
  const formSchema = z.object({
    department: z.enum([
      "Podiatrist",
      "Dermatologist",
      "Pediatrician",
      "Psychiatrist",
      "General Practitioner",
    ]),
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialisation: "",
  });

  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createDoctor = async () => {
    const options = {
      method: "POST",
      url: `/doctors`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/doctors", {
        state: {
          type: "success",
          message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    createDoctor();
  };

  return (
    <>
      Create Doctor
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

        <select
          className="mt-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
        >
          <option value="">Select Specialisation</option>
          <option value="Podiatrist">Podiatrist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="Psychiatrist">Psychiatrist</option>
          <option value="General Practitioner">General Practitioner</option>
        </select>
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
