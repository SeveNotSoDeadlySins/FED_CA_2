import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import FormCard from "@/components/FormCard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

// Define Zod schema for validation
const doctorSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  specialisation: z.string().min(1, "Specialisation is required"),
});

export default function EditDoctor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "",
    },
    mode: "onChange",
  });

  // Fetch existing doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Reset form with fetched data
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          specialisation: data.specialisation,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctor");
      }
    };

    fetchDoctor();
  }, [id, token]);

  // Submit handler
  const submitForm = async (data) => {
    try {
      const response = await axios.patch(
        `/doctors/${id}`,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          specialisation: data.specialisation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Doctor updated successfully");
      navigate("/doctors");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update doctor");
    }
  };

  return (
    <>
      <Toaster />
      <FormCard
        title="Edit Doctor"
        onSubmit={form.handleSubmit(submitForm)}
        submitText="Save Doctor"
      >
        <Controller
          name="first_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>First Name</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="last_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Last Name</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Phone</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="specialisation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Specialisation</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormCard>
    </>
  );
}
