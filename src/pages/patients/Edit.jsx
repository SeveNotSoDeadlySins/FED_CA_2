import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import FormCard from "@/components/formcard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { formatDateDMY } from "@/components/DateFormat";

// Define Zod schema for validation
const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  date_of_birth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  address: z.string().min(1, "Address is required"),
});

export default function EditPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
    },
    mode: "onChange",
  });

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Reset form with fetched data
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: formatDateDMY(data.date_of_birth),
          address: data.address,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load patient");
      }
    };

    fetchPatient();
  }, [id, token]);

  // Submit handler
  const submitForm = async (data) => {
    try {
        // Convert DD/MM/YYYY -> YYYY-MM-DD
        const [dd, mm, yyyy] = data.date_of_birth.split("/");
        const isoDate = `${yyyy}-${mm}-${dd}`;

      const response = await axios.patch(
        `/patients/${id}`,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: isoDate,
          address: data.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Patient updated successfully");
      navigate("/patients");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update patient");
    }
  };

  return (
    <>
      <Toaster />
      <FormCard
        title="Edit Patient"
        onSubmit={form.handleSubmit(submitForm)}
        submitText="Save Patient"
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
          name="date_of_birth"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Date of Birth</FieldLabel>
              <Input {...field} placeholder="DD/MM/YYYY" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Address</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormCard>
    </>
  );
}